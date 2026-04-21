const express = require('express');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const router = express.Router();

const defaultEmployees = [
  {
    _id: 'default-1',
    name: 'Aarav Patel',
    age: 28,
    experience: 5,
    salary: 72000,
    previousCompany: 'TechBridge',
    domain: 'Developer',
    skills: ['React', 'Node.js', 'MongoDB'],
    image: 'https://i.pravatar.cc/150?img=12',
    status: 'active'
  },
  {
    _id: 'default-2',
    name: 'Mia Johnson',
    age: 32,
    experience: 8,
    salary: 85000,
    previousCompany: 'QualityWorks',
    domain: 'QA',
    skills: ['Selenium', 'Cypress', 'TestRail'],
    image: 'https://i.pravatar.cc/150?img=22',
    status: 'active'
  },
  {
    _id: 'default-3',
    name: 'Noah Williams',
    age: 26,
    experience: 4,
    salary: 68000,
    previousCompany: 'CloudStack',
    domain: 'Finance',
    skills: ['Excel', 'Budgeting', 'Forecasting'],
    image: 'https://i.pravatar.cc/150?img=34',
    status: 'active'
  },
  {
    _id: 'default-4',
    name: 'Sophia Lee',
    age: 29,
    experience: 6,
    salary: 78000,
    previousCompany: 'BrightFuture',
    domain: 'HR',
    skills: ['Recruitment', 'Onboarding', 'PeopleOps'],
    image: 'https://i.pravatar.cc/150?img=44',
    status: 'active'
  }
];

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.status === 'active' || req.query.status === 'past') {
      filter.status = req.query.status;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.json(employees.length ? employees : defaultEmployees);
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

    const domainAggregation = await Employee.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
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
      monthlyAggregation,
      domainAggregation,
      headcountData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to load stats',
      error
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // 1. Try finding in MongoDB if the ID is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const employee = await Employee.findById(req.params.id);
      if (employee) {
        return res.json(employee);
      }
    }

    // 2. Fallback to default employees if not found or if ID is a string (like 'default-1')
    const defaultEmp = defaultEmployees.find(emp => emp._id === req.params.id);
    if (defaultEmp) {
      return res.json(defaultEmp);
    }

    res.status(404).json({ message: 'Employee not found' });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      message: 'Unable to load employee',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      experience,
      salary,
      previousCompany,
      domain,
      skills,
      image = '',
      status = 'active'
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
    console.error('Employee creation failed:', error);
    res.status(400).json({
      message: 'Unable to create employee',
      error: error.message || error
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Prevent modification of default employees
    if (req.params.id.startsWith('default-')) {
      return res.status(403).json({ message: 'Sample employees cannot be modified. Please create a new employee to test this feature.' });
    }

    const updateData = {};
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
      error: error.message || error
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Prevent deletion of default employees
    if (req.params.id.startsWith('default-')) {
      return res.status(403).json({ message: 'Sample employees cannot be deleted.' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete employee',
      error: error.message || error
    });
  }
});

router.patch('/:id/markpast', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { status: 'past' }, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({
      message: 'Unable to mark employee as past',
      error
    });
  }
});

module.exports = router;