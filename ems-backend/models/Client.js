const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    ceo: { type: String, required: true },
    description: { type: String, default: '' },
    ongoingProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
