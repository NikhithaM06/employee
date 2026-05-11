const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
require('dotenv').config();

async function linkUser() {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      // Fallback for local usage. Server.js already provides a default as well.
      mongoUri = 'mongodb://localhost:27017/ems';
    }
    await mongoose.connect(mongoUri);



    
    // Find an employee
    const employee = await Employee.findOne({});
    if (!employee) {
      console.log("No employees found in DB.");
      return;
    }

    // Find the user abcd1234@gmail.com
    const userEmail = process.env.LINK_USER_EMAIL || 'abcd1234@gmail.com';
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (!user) {
      console.log(`User ${userEmail} not found.`);
      return;
    }

    // Link them
    user.employeeId = employee._id;
    await user.save();
    
    console.log(`Successfully linked user ${user.email} to employee ${employee.name}`);
    
    // Test population
    const populatedUser = await User.findOne({ email: userEmail.toLowerCase() }).populate('employeeId');
    if (!populatedUser?.employeeId) {
      console.log('Test: user linked but employee population failed.');
    } else {
      console.log(`Test: User ${populatedUser.email} has name: ${populatedUser.employeeId.name}`);
    }

    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

linkUser();
