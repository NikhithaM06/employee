const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: { type: String, default: '' },
    activeProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
