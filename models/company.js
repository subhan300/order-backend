const mongoose = require('mongoose');
const Modal = mongoose.model;
const company = new mongoose.Schema({
  companyName: { type: String, require: true },
  companyEmail: { type: String, required: true },
  companyPhone: { type: String, required: true },
  companyFax: { type: String, required: true },
  companyLogo: { type: String, required: true },
  companyLocation: { type: String },
  pricing: {
    type: Number,
    enum: [0, 1], // 0: No, 1: Yes
    required: 'Please specify at least one factor.',
  },
  budget: {
    type: Number,
    enum: [0, 1], // 0: No, 1: Yes
    required: 'Please specify at least one factor.',
  },
  status: {
    type: Number,
    enum: [0, 1, 2], // 0: request, 1: accepted, 2: rejected
    required: 'Please specify at least one factor.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = new Modal('company', company);
