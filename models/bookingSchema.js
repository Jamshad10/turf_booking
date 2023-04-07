const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  turf: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  booked: [{
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    turf: {
      type: String,
      required: true
    }
  }]
});

const booking = mongoose.model("Booking", bookingSchema);
module.exports = booking;