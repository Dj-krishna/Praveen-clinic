const Appointment = require('../models/Appointments');

/**
 * Updates appointment status to 'completed' when end time has passed
 * This function should be called periodically (e.g., every minute)
 */
const updateExpiredAppointments = async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Get current time in HH:MM format (HH:MM)
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Get current date at midnight

    console.log(`🕐 Checking for expired appointments at ${currentTime} on ${currentDate.toDateString()}`);

    // Find appointments that:
    // 1. Are currently 'booked' status
    // 2. Have a date that is today or in the past
    // 3. Have an end time that has already passed
    const expiredAppointments = await Appointment.find({
      status: 'booked',
      $or: [
        // Today's appointments with end time passed
        {
          date: currentDate,
          endTime: { $lt: currentTime }
        },
        // Past appointments (any end time)
        {
          date: { $lt: currentDate }
        }
      ]
    });

    if (expiredAppointments.length === 0) {
      // Don't log when no appointments to update to reduce console noise
      return { updated: 0 };
    }

    console.log(`📋 Found ${expiredAppointments.length} expired appointments to update`);

    // Update all expired appointments to 'completed'
    const updateResult = await Appointment.updateMany(
      {
        _id: { $in: expiredAppointments.map(apt => apt._id) }
      },
      {
        status: 'completed'
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Updated ${updateResult.modifiedCount} appointments to completed status`);
      
      // Log details of updated appointments for debugging
      const updatedAppointments = await Appointment.find({
        _id: { $in: expiredAppointments.map(apt => apt._id) }
      });
      
      updatedAppointments.forEach(apt => {
        console.log(`   - Appointment ${apt.appointmentID}: ${apt.date.toDateString()} ${apt.startTime}-${apt.endTime} → completed`);
      });
    }
    
    return { updated: updateResult.modifiedCount };
  } catch (error) {
    console.error('❌ Error updating expired appointments:', error);
    throw error;
  }
};

/**
 * Manual trigger to update expired appointments
 * Can be called via API endpoint for immediate updates
 */
const manualUpdateExpiredAppointments = async () => {
  try {
    const result = await updateExpiredAppointments();
    return result;
  } catch (error) {
    console.error('Manual update failed:', error);
    throw error;
  }
};

module.exports = {
  updateExpiredAppointments,
  manualUpdateExpiredAppointments
};
