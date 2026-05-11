const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await User.find({}, 'email role employeeId').lean();
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
})();
