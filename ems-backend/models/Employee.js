const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    experience: { type: Number, required: true },
    salary: { type: Number, required: true },
    previousCompany: { type: String, default: '' },
    domain: {
      type: String,
      enum: ['Developer', 'QA', 'HR', 'Finance'],
      required: true
    },
    skills: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'past'],
      default: 'active'
    },
    leftDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Employee', employeeSchema);