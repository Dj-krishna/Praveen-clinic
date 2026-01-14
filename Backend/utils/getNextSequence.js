const Counter = require('../models/Counter');

const getNextSequence = async (sequenceName) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName, // e.g., 'doctorID'
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequence_value;
};

module.exports = getNextSequence;
