const express = require('express');
const Service = require('../models/Service');

const defaultServices = [
  {
    _id: 'default-sv-1',
    name: 'Apps',
    description: 'Custom mobile and desktop applications for modern workflows.',
    activeProjects: 6,
    completedProjects: 14
  },
  {
    _id: 'default-sv-2',
    name: 'Websites',
    description: 'Responsive websites and portals built with user-first design.',
    activeProjects: 5,
    completedProjects: 18
  },
  {
    _id: 'default-sv-3',
    name: 'E-Commerce',
    description: 'Online stores optimized for conversion, performance, and scale.',
    activeProjects: 4,
    completedProjects: 11
  },
  {
    _id: 'default-sv-4',
    name: 'Maintenance',
    description: 'Ongoing support, monitoring, and enhancement services.',
    activeProjects: 9,
    completedProjects: 27
  }
];

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services.length ? services : defaultServices);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load services', error });
  }
});

module.exports = router;
