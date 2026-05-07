const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load services', error });
  }
});

module.exports = router;
