const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

const employees = [
  {
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
    name: 'Sophia Lee',
    age: 29,
    experience: 6,
    salary: 78000,
    previousCompany: 'BrightFuture',
    domain: 'HR',
    skills: ['Recruitment', 'Onboarding', 'PeopleOps'],
    image: 'https://i.pravatar.cc/150?img=44',
    status: 'active'
  },
  {
    name: 'Ethan Brown',
    age: 35,
    experience: 10,
    salary: 93000,
    previousCompany: 'SecureSoft',
    domain: 'Developer',
    skills: ['Python', 'Django', 'AWS'],
    image: 'https://i.pravatar.cc/150?img=55',
    status: 'past'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await Employee.deleteMany({});
    const created = await Employee.insertMany(employees);

    console.log(`Seeded ${created.length} employees`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
