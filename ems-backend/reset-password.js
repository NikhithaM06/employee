const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';

async function resetPassword() {
  try {
    await mongoose.connect(MONGO_URI);
    const user = await User.findOne({ email: 'shravyasahitya793@gmail.com' });

    if (!user) {
      console.log('User not found');
      return;
    }

    // Set new password
    user.password = 'test123';
    await user.save();

    console.log('Password reset to "test123" for user:', user.email);

    // Verify it works
    const isMatch = await user.comparePassword('test123');
    console.log('Password verification:', isMatch);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

resetPassword();