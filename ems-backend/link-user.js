const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');
require('dotenv').config();

async function linkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find an employee
    const employee = await Employee.findOne({});
    if (!employee) {
      console.log("No employees found in DB.");
      return;
    }

    // Find the user abcd1234@gmail.com
    const user = await User.findOne({ email: 'abcd1234@gmail.com' });
    if (!user) {
      console.log("User abcd1234@gmail.com not found.");
      return;
    }

    // Link them
    user.employeeId = employee._id;
    await user.save();
    
    console.log(`Successfully linked user ${user.email} to employee ${employee.name}`);
    
    // Test population
    const populatedUser = await User.findOne({ email: 'abcd1234@gmail.com' }).populate('employeeId');
    console.log(`Test: User ${populatedUser.email} has name: ${populatedUser.employeeId.name}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

linkUser();
