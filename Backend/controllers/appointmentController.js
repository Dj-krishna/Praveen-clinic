const Doctor = require("../models/Doctors");
const Patient = require("../models/Patients");
const Appointment = require("../models/Appointments");
const DoctorSlot = require("../models/DoctorSlots");
const getNextSequence = require("../utils/getNextSequence");
const { manualUpdateExpiredAppointments } = require("../utils/appointmentStatusUpdater");

// Normalize date to start or end of day (UTC-safe)
const normalizeDate = (d, end = false) => {
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  dt.setUTCHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0);
  return dt;
};

const buildAppointmentFilter = (query) => {
  const filter = {};

  if (query.doctorID) filter.doctorID = Number(query.doctorID);
  if (query.patientID) filter.patientID = Number(query.patientID);

  if (query.fromDate || query.toDate) {
    const from = query.fromDate ? normalizeDate(query.fromDate) : null;
    const to = query.toDate ? normalizeDate(query.toDate, true) : null;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }
  } else if (query.date) {
    const start = normalizeDate(query.date);
    const end = normalizeDate(query.date, true);
    if (start && end) filter.date = { $gte: start, $lte: end };
  }

  return filter;
};

// utils/timeUtils.js
function addMinutesToTime(timeStr, minutes) {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString().substring(11, 16);
}

// ------------------ GET APPOINTMENTS ------------------
exports.getAppointments = async (req, res) => {
  try {
    if (!req.query.status || req.query.status === "booked") {
      await Appointment.updateExpiredAppointments();
    }

    const filter = buildAppointmentFilter(req.query);

    // Separate patientContact filters
    const patientContactFilters = {};
    Object.keys(req.query).forEach((key) => {
      if (key.startsWith("patientContact.")) {
        const subField = key.split(".")[1];
        patientContactFilters[subField] = req.query[key];
      }
    });

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorID",
          foreignField: "doctorID",
          as: "doctor",
        },
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "patients",
          localField: "patientID",
          foreignField: "patientID",
          as: "patient",
        },
      },
      { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          doctorName: { $ifNull: ["$doctor.fullName", null] },
          patientName: { $ifNull: ["$patient.fullName", null] },
          patientContact: {
            email: { $ifNull: ["$patient.email", null] },
            mobile: { $ifNull: ["$patient.mobile", null] },
            countryCode: { $ifNull: ["$patient.countryCode", null] },
            fullMobile: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$patient.countryCode", false] },
                    { $ifNull: ["$patient.mobile", false] },
                  ],
                },
                { $concat: ["$patient.countryCode", "$patient.mobile"] },
                "$patient.mobile",
              ],
            },
          },
        },
      },
    ];

    // Apply patientContact filters after patientContact fields are added
    if (Object.keys(patientContactFilters).length > 0) {
      const contactMatch = {};
      for (const field in patientContactFilters) {
        const value = patientContactFilters[field];
        if (field === "fullMobile") {
          contactMatch.$or = [
            { "patientContact.fullMobile": value },
            { "patientContact.mobile": value },
          ];
        } else {
          contactMatch[`patientContact.${field}`] = value;
        }
      }
      pipeline.push({ $match: contactMatch });
    }

    // Remove original patient and doctor fields
    pipeline.push({ $project: { doctor: 0, patient: 0 } });

    // Sorting
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      pipeline.push({ $sort: { [req.query.sortBy]: sortOrder } });
    } else {
      pipeline.push({ $sort: { date: 1, startTime: 1 } });
    }

    const appointments = await Appointment.aggregate(pipeline);

    if (req.query.appointmentID) {
      return appointments.length
        ? res.status(200).json(appointments[0])
        : res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      count: appointments.length,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ GET AVAILABLE SLOTS ------------------
exports.getAvailableSlots = async (req, res) => {
  try {
    const doctorID = Number(req.query.doctorID);
    const date = req.query.date ? normalizeDate(req.query.date) : null;

    if (!doctorID || !date) {
      return res.status(400).json({ error: "doctorID and date required" });
    }

    const doctorSlots = await DoctorSlot.findOne({ doctorID, isActive: true });
    if (!doctorSlots) return res.status(404).json({ message: "No slots found for doctor" });

    const scheduleRange = doctorSlots.schedule.find(
      (r) => date >= normalizeDate(r.fromDate) && date <= normalizeDate(r.toDate, true)
    );
    if (!scheduleRange) return res.status(404).json({ message: "No schedule for this date" });

    const daySchedule = scheduleRange.eachSchedule.find(
      (d) => normalizeDate(d.date).getTime() === date.getTime()
    );
    if (!daySchedule) return res.status(404).json({ message: "No slots for this day" });

    const allSlots = [...daySchedule.morningSlot, ...daySchedule.eveningSlot];

    const bookedAppointments = await Appointment.find({
      doctorID,
      date,
      status: { $in: ["booked", "completed"] },
    });

    const bookedSet = new Set(bookedAppointments.map((a) => `${a.startTime}-${a.endTime}`));

    const availableSlots = [];
    for (let i = 0; i < allSlots.length - 1; i++) {
      const start = allSlots[i];
      const end = allSlots[i + 1];
      if (!bookedSet.has(`${start}-${end}`)) {
        availableSlots.push({ startTime: start, endTime: end });
      }
    }

    res.json({ doctorID, date, availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ ADD APPOINTMENT ------------------
exports.addAppointment = async (req, res) => {
  try {
    const {
      doctorID, date, startTime, endTime,
      mobile, email, fullName, countryCode, packageIDs,
      isWhatsAppNumber, termsAccepted, marketingConsent
    } = req.body;

    if (!doctorID || !date || !startTime || !mobile || !fullName) {
      return res.status(400).json({ error: "doctorID, date, startTime, mobile, fullName required" });
    }

    const normalizedDate = normalizeDate(date);
    let patient = await Patient.findOne({ mobile });

    if (!patient) {
      const patientID = await getNextSequence("patientID");
      patient = new Patient({
        patientID,
        fullName,
        mobile,
        email: email || null,
        countryCode: countryCode || null,
        doctorID,
        packageIDs: Array.isArray(packageIDs) ? packageIDs : [],
      });
      await patient.save();
    }

    let finalEndTime = endTime;
    if (!finalEndTime) {
      const doctorSlots = await DoctorSlot.findOne({ doctorID, isActive: true });
      if (!doctorSlots) return res.status(404).json({ message: "Doctor slots not found" });
      const interval = doctorSlots.timeSlotInterval || 30;
      finalEndTime = addMinutesToTime(startTime, interval);
    }

    const existing = await Appointment.findOne({
      doctorID,
      date: normalizedDate,
      startTime,
      endTime: finalEndTime,
      status: { $in: ["booked", "completed"] },
    });
    if (existing) return res.status(400).json({ error: "Slot already booked" });

    const appointmentID = await getNextSequence("appointmentID");
    const appointment = new Appointment({
      appointmentID,
      doctorID,
      patientID: patient.patientID,
      date: normalizedDate,
      startTime,
      endTime: finalEndTime,
      mobile,
      email: email || patient.email,
      packageIDs: Array.isArray(packageIDs) ? packageIDs : [],
      status: "booked",
      isWhatsAppNumber: !!isWhatsAppNumber,
      termsAccepted: !!termsAccepted,
      marketingConsent: !!marketingConsent,
    });
    await appointment.save();

    const doctor = await Doctor.findOne({ doctorID }, { fullName: 1 });

    res.status(201).json({
      message: "Appointment booked successfully",
      patient: {
        patientID: patient.patientID,
        fullName: patient.fullName,
        mobile: patient.mobile,
        email: patient.email,
      },
      appointment: {
        appointmentID: appointment.appointmentID,
        doctorID,
        doctorName: doctor ? doctor.fullName : null,
        patientID: patient.patientID,
        patientName: patient.fullName,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        isWhatsAppNumber: appointment.isWhatsAppNumber,
        termsAccepted: appointment.termsAccepted,
        marketingConsent: appointment.marketingConsent,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ UPDATE APPOINTMENT ------------------
exports.updateAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: "Invalid appointmentID" });

    const allowedUpdates = {
      ...req.body,
      isWhatsAppNumber: req.body.isWhatsAppNumber ?? undefined,
      termsAccepted: req.body.termsAccepted ?? undefined,
      marketingConsent: req.body.marketingConsent ?? undefined,
    };

    const updated = await Appointment.findOneAndUpdate({ appointmentID }, allowedUpdates, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment updated successfully", appointment: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ DELETE APPOINTMENT(S) ------------------
exports.deleteAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.params.ids) {
      const ids = req.params.ids.split(",").map(id => Number(id.trim())).filter(id => !isNaN(id));
      if (!ids.length) return res.status(400).json({ error: "No valid IDs provided" });
      filter = { appointmentID: { $in: ids } };
    } else if (req.query.appointmentID) {
      const ids = req.query.appointmentID.split(",").map(id => Number(id.trim()));
      filter = ids.length > 1 ? { appointmentID: { $in: ids } } : { appointmentID: ids[0] };
    } else if (Object.keys(req.query).length > 0) {
      filter = buildAppointmentFilter(req.query);
    } else if (req.body.filter) {
      if (typeof req.body.filter !== "object") return res.status(400).json({ error: "Provide valid filter" });
      filter = req.body.filter;
    } else {
      return res.status(400).json({ error: "No filter provided" });
    }

    const toDelete = await Appointment.find(filter);
    if (!toDelete.length) return res.status(404).json({ message: "No appointments found matching criteria" });

    const result = await Appointment.deleteMany(filter);
    res.json({
      message: toDelete.length === 1 ? "Appointment deleted" : "Appointments deleted",
      deletedCount: result.deletedCount,
      deletedAppointments: toDelete,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------ SPECIAL ------------------
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: "Invalid appointmentID" });

    const cancelled = await Appointment.findOneAndUpdate({ appointmentID }, { status: "cancelled" }, { new: true });
    if (!cancelled) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment cancelled", appointment: cancelled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeAppointment = async (req, res) => {
  try {
    const appointmentID = Number(req.params.id);
    if (isNaN(appointmentID)) return res.status(400).json({ error: "Invalid appointmentID" });

    const completed = await Appointment.findOneAndUpdate({ appointmentID }, { status: "completed" }, { new: true });
    if (!completed) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment marked completed", appointment: completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpiredAppointments = async (req, res) => {
  try {
    const result = await manualUpdateExpiredAppointments();
    res.json({ message: "Expired appointments updated successfully", updatedCount: result.updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
