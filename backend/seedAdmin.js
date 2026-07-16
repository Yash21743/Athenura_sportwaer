const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully for seeding...');

    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log(`Admin user already exists with email: ${adminExists.email}`);
      console.log('You can use this email and your existing password to log in.');
    } else {
      // Create default admin user
      const defaultAdmin = await User.create({
        name: 'Default Admin',
        email: 'admin@athenura.com',
        password: 'admin12345',
        role: 'admin'
      });
      console.log('==================================================');
      console.log('Default Admin Account Created Successfully!');
      console.log(`Email: ${defaultAdmin.email}`);
      console.log('Password: admin12345');
      console.log('==================================================');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedAdmin();
