const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

async function checkPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    const user = await User.findOne({ email: 'shravyasahitya793@gmail.com' });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Hashed password:', user.password);

    // Test password comparison
    const isMatch = await user.comparePassword('test123');
    console.log('Password "test123" matches:', isMatch);

    // Also test bcrypt directly
    const directMatch = await bcrypt.compare('test123', user.password);
    console.log('Direct bcrypt compare:', directMatch);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkPassword();