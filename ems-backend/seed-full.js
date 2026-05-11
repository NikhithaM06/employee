const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
const Client = require('./models/Client');
const Service = require('./models/Service');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

const employees = [
  {
    name: 'Karthik Iyer',
    age: 29,
    experience: 6,
    salary: 82000,
    previousCompany: 'Zomato',
    domain: 'Developer',
    skills: ['React', 'Node.js', 'AWS', 'GraphQL'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    createdAt: new Date('2026-05-02') // This month
  },
  {
    name: 'Sneha Rao',
    age: 27,
    experience: 4,
    salary: 75000,
    previousCompany: 'Swiggy',
    domain: 'Developer',
    skills: ['Vue.js', 'Python', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    createdAt: new Date('2026-05-05') // This month
  },
  {
    name: 'Vikram Sethi',
    age: 34,
    experience: 10,
    salary: 120000,
    previousCompany: 'Uber India',
    domain: 'Developer',
    skills: ['Java', 'Spring Boot', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    createdAt: new Date('2026-04-15') // Last month
  },
  {
    name: 'Meera Deshmukh',
    age: 25,
    experience: 2,
    salary: 55000,
    previousCompany: 'FreshWorks',
    domain: 'HR',
    skills: ['Talent Acquisition', 'Employee Engagement'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    createdAt: new Date('2026-03-10')
  },
  {
    name: 'Rohan Mehra',
    age: 31,
    experience: 8,
    salary: 95000,
    previousCompany: 'Paytm',
    domain: 'QA',
    skills: ['Cypress', 'Playwright', 'Jira'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    status: 'active',
    createdAt: new Date('2026-02-20')
  },
  {
    name: 'Anjali Sharma',
    age: 28,
    experience: 5,
    salary: 68000,
    previousCompany: 'TCS',
    domain: 'Finance',
    skills: ['Taxation', 'Tally', 'SAP'],
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
    status: 'past',
    leftDate: new Date('2026-04-30'),
    createdAt: new Date('2025-06-01')
  },
  {
    name: 'Abhishek Verma',
    age: 30,
    experience: 7,
    salary: 88000,
    previousCompany: 'Infosys',
    domain: 'Developer',
    skills: ['Angular', 'Go', 'Docker'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'past',
    leftDate: new Date('2026-03-15'),
    createdAt: new Date('2025-01-10')
  }
];

const clients = [
  {
    companyName: 'NexGen Retail',
    ceo: 'Suresh Kumar',
    ongoingProjects: 3,
    completedProjects: 7,
    description: 'Leading e-commerce player in Southeast Asia looking for digital transformation.'
  },
  {
    companyName: 'Pulse Health',
    ceo: 'Dr. Anita Desai',
    ongoingProjects: 1,
    completedProjects: 4,
    description: 'A health-tech startup focusing on remote patient monitoring systems.'
  },
  {
    companyName: 'EcoStream Energy',
    ceo: 'Robert Dowson',
    ongoingProjects: 2,
    completedProjects: 2,
    description: 'Sustainable energy provider implementing smart grid solutions.'
  },
  {
    companyName: 'FinLeap Global',
    ceo: 'Marcus Cheng',
    ongoingProjects: 4,
    completedProjects: 15,
    description: 'Global fintech conglomerate specializing in cross-border payments.'
  }
];

const services = [
  {
    name: 'Mobile App Development',
    description: 'End-to-end iOS and Android development with Flutter and React Native.',
    activeProjects: 4,
    completedProjects: 22
  },
  {
    name: 'Enterprise Web Solutions',
    description: 'Scalable web applications for complex business workflows and internal tools.',
    activeProjects: 6,
    completedProjects: 35
  },
  {
    name: 'Cloud Infrastructure',
    description: 'AWS/Azure migration, DevOps automation, and cost optimization services.',
    activeProjects: 2,
    completedProjects: 12
  },
  {
    name: 'UI/UX Design Systems',
    description: 'Modern design systems and user research for seamless product experiences.',
    activeProjects: 3,
    completedProjects: 18
  },
  {
    name: 'QA & Test Automation',
    description: 'Rigorous testing frameworks ensuring zero-bug production releases.',
    activeProjects: 5,
    completedProjects: 27
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert employees, clients, and services
    const createdEmployees = await Employee.insertMany(employees);
    await Client.insertMany(clients);
    await Service.insertMany(services);
    console.log('✅ Seeded Employees, Clients, and Services');

    // Create Admin users
    const admin3 = new User({
      email: 'nikhitha123@gmail.com',
      password: 'nikhitha',
      role: 'admin'
    });
    await admin3.save();

    console.log('✅ Seeded Users:');
    console.log('   - Admin: nikhitha123@gmail.com / nikhitha');

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
