const Counter = require("./counterModel");

exports.getNextSequence = async (key) => {
  const result = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return result.seq;
};
