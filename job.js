const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

const JobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['open', 'in progress', 'completed', 'cancelled'], default: 'open' },
  applications: [ApplicationSchema],
  funded: { type: Boolean, default: false }
});

module.exports = mongoose.model('Job', JobSchema);
