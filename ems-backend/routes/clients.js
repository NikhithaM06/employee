const express = require('express');
const Client = require('../models/Client');

const defaultClients = [
  {
    _id: 'default-cl-1',
    companyName: 'BrightWave Solutions',
    ceo: 'Ananya Sharma',
    ongoingProjects: 5,
    completedProjects: 12,
    description: 'A digital transformation partner for creative agencies and startups.'
  },
  {
    _id: 'default-cl-2',
    companyName: 'NovaTech Systems',
    ceo: 'Rohan Verma',
    ongoingProjects: 3,
    completedProjects: 8,
    description: 'Enterprise software and cloud migration specialists.'
  },
  {
    _id: 'default-cl-3',
    companyName: 'Apex Finance Group',
    ceo: 'Meera Joshi',
    ongoingProjects: 2,
    completedProjects: 5,
    description: 'Financial services and analytics platform provider.'
  },
  {
    _id: 'default-cl-4',
    companyName: 'PixelPulse Media',
    ceo: 'Kabir Malik',
    ongoingProjects: 4,
    completedProjects: 10,
    description: 'Full-service digital marketing and web experience agency.'
  }
];

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ companyName: 1 });
    res.json(clients.length ? clients : defaultClients);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load clients', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load client', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { companyName, ceo, description, ongoingProjects, completedProjects } = req.body;
    const client = new Client({
      companyName,
      ceo,
      ongoingProjects: Number(ongoingProjects) || 0,
      completedProjects: Number(completedProjects) || 0,
      description
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Unable to create client', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = {};

    if (req.body.companyName !== undefined) updateData.companyName = req.body.companyName;
    if (req.body.ceo !== undefined) updateData.ceo = req.body.ceo;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.ongoingProjects !== undefined) updateData.ongoingProjects = Number(req.body.ongoingProjects);
    if (req.body.completedProjects !== undefined) updateData.completedProjects = Number(req.body.completedProjects);

    const client = await Client.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Unable to update client', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete client', error });
  }
});

module.exports = router;
