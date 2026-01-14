const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// ------------------ CRUD ------------------
router.get("/", appointmentController.getAppointments);          // Get all appointments with filters (including by ID)

router.post("/", appointmentController.addAppointment);          // Create appointment
router.put("/:id", appointmentController.updateAppointment);     // Update appointment

// ------------------ DELETE ------------------
router.delete("/bulk/:ids", appointmentController.deleteAppointments); // Bulk delete by IDs (comma separated in param)
router.delete("/", appointmentController.deleteAppointments);          // Delete by query or body filter

// ------------------ Special GET ------------------
router.get("/availableSlots", appointmentController.getAvailableSlots); // Get available slots for doctor on date

// ------------------ Special Actions ------------------
// ------------------ Status Management ------------------
// Cancel appointment
router.put("/:id/status/cancel", appointmentController.cancelAppointment);

// Mark appointment as completed
router.put("/:id/status/complete", appointmentController.completeAppointment);

// Mark expired appointments as completed (system action)
router.post("/status/expired", appointmentController.updateExpiredAppointments);

module.exports = router;
