const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const defaultUsers = [
  {
    name: 'Dharshana S',
    email: 'dharshana.s2024csbs@sece.ac.in',
    password: 'student123',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    hostelBlock: 'A',
    roomNumber: '101'
  },
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.faculty@sece.ac.in',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science'
  },
  {
    name: 'Warden A Block',
    email: 'warden.ablock@sece.ac.in',
    password: 'warden123',
    role: 'warden',
    department: 'Hostel Management'
  },
  {
    name: 'Rudhra Admin',
    email: 'rudhra.admin@sece.ac.in',
    password: 'admin123',
    role: 'admin',
    department: 'Administration'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create default users
    for (const userData of defaultUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n✅ Default users created successfully!\n');
    console.log('=== LOGIN CREDENTIALS ===');
    console.log('Student:');
    console.log('  Email: dharshana.s2024csbs@sece.ac.in');
    console.log('  Password: student123\n');
    console.log('Faculty:');
    console.log('  Email: rajesh.faculty@sece.ac.in');
    console.log('  Password: faculty123\n');
    console.log('Warden:');
    console.log('  Email: warden.ablock@sece.ac.in');
    console.log('  Password: warden123\n');
    console.log('Admin:');
    console.log('  Email: rudhra.admin@sece.ac.in');
    console.log('  Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedUsers();
