const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentID: { type: Number, required: true, unique: true },
  doctorID: { type: Number, required: true },
  patientID: { type: Number},
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // "10:00"
  endTime: { type: String, required: true },   // "10:30"
  mobile: { type: String, required: true},
  email: { type: String },
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },
  isWhatsAppNumber: { type: Boolean, default: false },
  termsAccepted: { type: Boolean, default: false },
  marketingConsent: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

// Prevent double booking on same doctor, date, and slot
appointmentSchema.index({ doctorID: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

// Middleware to automatically update status when appointments are retrieved
appointmentSchema.pre('find', function() {
  // This will run before any find operation
  // We'll handle the status update in the controller instead
});

// Static method to update expired appointments
appointmentSchema.statics.updateExpiredAppointments = async function() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return await this.updateMany(
    {
      status: 'booked',
      $or: [
        {
          date: currentDate,
          endTime: { $lt: currentTime }
        },
        {
          date: { $lt: currentDate }
        }
      ]
    },
    {
      status: 'completed'
    }
  );
};

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');