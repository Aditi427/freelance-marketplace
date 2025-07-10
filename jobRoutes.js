const express = require('express');
const router = express.Router();
const Job = require('./job');
const authorize = require('./authorize');
const protect= require('./authMiddleware');

//Client posts a job
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const job = await Job.create({ 
      clientId: req.user.id,
      ...req.body
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error posting job', error: err.message });
  }
});

//Get all open jobs
router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('clientId', 'username email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

//Get jobs posted by client
router.get('/client', protect, authorize('client'), async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).populate('applications.freelancerId', 'username email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching client jobs', error: err.message });
  }
});

//Freelancer applies to a job
router.post('/:id/apply', protect, authorize('freelancer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'Job not available for application' });
    }
    const alreadyApplied = job.applications.some(app => app.freelancerId.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    job.applications.push({
      freelancerId: req.user.id,
      coverLetter: req.body.coverLetter,
      bidAmount: req.body.bidAmount,
      deliveryTime: req.body.deliveryTime
    });
    await job.save();
    res.status(201).json({ message: 'Application submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Error applying to job', error: err.message });
  }
});

module.exports = router;


