const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}

const sampleEmployees = [
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
  }
];

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully.');

    console.log('⚙️ Cleaning existing employees...');
    await Employee.deleteMany({});
    console.log('✅ Database cleared.');

    console.log('🚀 Seeding sample data...');
    const result = await Employee.insertMany(sampleEmployees);
    console.log(`✅ Successfully seeded ${result.length} employees with real ObjectIds.`);

    await mongoose.connection.close();
    console.log('🏁 Connection closed. Your Atlas database is now ready.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
