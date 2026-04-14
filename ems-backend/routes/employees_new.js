const express = require('express');
const Employee = require('../models/Employee');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const filter = {};

    if (req.query.status === 'active' || req.query.status === 'past') {
      filter.status = req.query.status;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.json(employees.length ? employees : []);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to load employees',
      error
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const activeCount = await Employee.countDocuments({ status: 'active' });
    const pastCount = await Employee.countDocuments({ status: 'past' });
    const clientsCount = null;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newThisMonth = await Employee.countDocuments({
      status: 'active',
      createdAt: { $gte: firstOfMonth }
    });

    const monthlyAggregation = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const headcountData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i).toLocaleString('default', { month: 'short' });
      const data = monthlyAggregation.find(item => item._id.month === i + 1);
      return { month, headcount: data ? data.count : 0 };
    });

    res.json({
      activeCount,
      pastCount,
      clientsCount,
      newThisMonth,
      headcountData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to load stats',
      error
    });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to load employee',
      error
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      age,
      experience,
      salary,
      previousCompany,
      domain,
      skills,
      image,
      status
    } = req.body;

    const employee = new Employee({
      name,
      age,
      experience,
      salary,
      previousCompany,
      domain,
      skills: Array.isArray(skills)
        ? skills
        : skills?.split(',').map((skill) => skill.trim()).filter(Boolean),
      image,
      status
    });

    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({
      message: 'Unable to create employee',
      error
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = ['name', 'age', 'experience', 'salary', 'previousCompany', 'domain', 'skills', 'image', 'status'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.skills && typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({
      message: 'Unable to update employee',
      error
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete employee',
      error
    });
  }
});

module.exports = router;