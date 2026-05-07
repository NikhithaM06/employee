const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}).lean();
    console.log(users);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

test();
