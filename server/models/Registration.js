const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  eventId: {
    type: String,
    required: true,
  },
});


registrationSchema.index(
  { email: 1, eventId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Registration",
  registrationSchema
);