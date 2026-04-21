const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Client = require('./models/Client');
const Service = require('./models/Service');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

if (!process.env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI not found in .env, using default local connection.');
}

const employees = [
  {
    name: 'Arjun Singh',
    age: 28,
    experience: 5,
    salary: 75000,
    previousCompany: 'TechCorp India',
    domain: 'Developer',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Priya Sharma',
    age: 26,
    experience: 3,
    salary: 60000,
    previousCompany: 'InfoSys',
    domain: 'QA',
    skills: ['Selenium', 'TestNG', 'Manual Testing', 'Bug Tracking'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Rahul Patel',
    age: 32,
    experience: 8,
    salary: 95000,
    previousCompany: 'Google India',
    domain: 'Developer',
    skills: ['Python', 'Django', 'AWS', 'Docker'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Neha Gupta',
    age: 24,
    experience: 2,
    salary: 50000,
    previousCompany: 'StartupXYZ',
    domain: 'HR',
    skills: ['Recruitment', 'Employee Relations', 'Payroll'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Vikram Kumar',
    age: 30,
    experience: 6,
    salary: 85000,
    previousCompany: 'Flipkart',
    domain: 'Developer',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Swati Desai',
    age: 29,
    experience: 5,
    salary: 78000,
    previousCompany: 'Accenture',
    domain: 'QA',
    skills: ['Cypress', 'API Testing', 'Performance Testing', 'Jira'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Aditya Nair',
    age: 35,
    experience: 10,
    salary: 120000,
    previousCompany: 'Microsoft',
    domain: 'Developer',
    skills: ['C#', '.NET', 'Azure', 'SQL Server'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Ishita Reddy',
    age: 27,
    experience: 4,
    salary: 65000,
    previousCompany: 'PWC',
    domain: 'Finance',
    skills: ['Financial Analysis', 'Excel', 'SAP', 'Cost Accounting'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Rohan Bhatia',
    age: 28,
    experience: 5,
    salary: 72000,
    previousCompany: 'HCL Tech',
    domain: 'Developer',
    skills: ['Vue.js', 'GraphQL', 'PostgreSQL', 'Git'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Anjali Singh',
    age: 31,
    experience: 7,
    salary: 88000,
    previousCompany: 'Amazon India',
    domain: 'Developer',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Manish Verma',
    age: 33,
    experience: 9,
    salary: 110000,
    previousCompany: 'Apple India',
    domain: 'QA',
    skills: ['Test Automation', 'LoadRunner', 'QTP', 'UAT'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'past',
    leftDate: new Date('2026-03-15')
  },
  {
    name: 'Riya Chopra',
    age: 26,
    experience: 3,
    salary: 58000,
    previousCompany: 'Uber India',
    domain: 'Finance',
    skills: ['Accounting', 'Tax Compliance', 'Audit', 'QuickBooks'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    status: 'active'
  },
  {
    name: 'Nikhil Kapoor',
    age: 30,
    experience: 6,
    salary: 82000,
    previousCompany: 'Netflix India',
    domain: 'Developer',
    skills: ['Kubernetes', 'Docker', 'Linux', 'CI/CD'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'past',
    leftDate: new Date('2026-02-28')
  }
];

const clients = [
  {
    companyName: 'BrightWave Solutions',
    ceo: 'Ananya Sharma',
    ongoingProjects: 5,
    completedProjects: 12,
    description: 'A digital transformation partner for creative agencies and startups.'
  },
  {
    companyName: 'NovaTech Systems',
    ceo: 'Rohan Verma',
    ongoingProjects: 3,
    completedProjects: 8,
    description: 'Enterprise software and cloud migration specialists.'
  },
  {
    companyName: 'Apex Finance Group',
    ceo: 'Meera Joshi',
    ongoingProjects: 2,
    completedProjects: 5,
    description: 'Financial services and analytics platform provider.'
  },
  {
    companyName: 'PixelPulse Media',
    ceo: 'Kabir Malik',
    ongoingProjects: 4,
    completedProjects: 10,
    description: 'Full-service digital marketing and web experience agency.'
  },
  {
    companyName: 'Horizon Health Tech',
    ceo: 'Sana Kapoor',
    ongoingProjects: 1,
    completedProjects: 3,
    description: 'Healthcare SaaS solutions focused on patient engagement.'
  }
];

const services = [
  {
    name: 'Apps',
    description: 'Custom mobile and desktop applications for modern workflows.',
    activeProjects: 6,
    completedProjects: 14
  },
  {
    name: 'Websites',
    description: 'Responsive websites and portals built with user-first design.',
    activeProjects: 5,
    completedProjects: 18
  },
  {
    name: 'E-Commerce',
    description: 'Online stores optimized for conversion, performance, and scale.',
    activeProjects: 4,
    completedProjects: 11
  },
  {
    name: 'Maintenance',
    description: 'Ongoing support, monitoring, and enhancement services.',
    activeProjects: 9,
    completedProjects: 27
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`📡 Connected to MongoDB: ${MONGO_URI.split('@').pop().split('/')[0]} (Seeding mode)`);

    // Clear existing data
    await Employee.deleteMany({});
    await Client.deleteMany({});
    await Service.deleteMany({});

    // Insert employees, clients, and services
    const createdEmployees = await Employee.insertMany(employees);
    const createdClients = await Client.insertMany(clients);
    const createdServices = await Service.insertMany(services);

    console.log(`✅ Seeded ${createdEmployees.length} employees`);
    console.log(`✅ Seeded ${createdClients.length} clients`);
    console.log(`✅ Seeded ${createdServices.length} services`);
    console.log('\n📊 Database ready for testing!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
