import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

const seedData = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create admin user
    const adminUser = await User.findOne({ email: 'admin@ambouniversity.edu' });
    if (!adminUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@ambouniversity.edu',
        password: 'admin123', // Will be hashed automatically
        role: 'Admin'
      });
    }

    // Create inventory manager
    const managerUser = await User.findOne({ email: 'manager@ambouniversity.edu' });
    if (!managerUser) {
      await User.create({
        name: 'Inventory Manager',
        email: 'manager@ambouniversity.edu',
        password: 'manager123', // Will be hashed automatically
        role: 'Inventory Manager'
      });
    }

    // Create staff user
    const staffUser = await User.findOne({ email: 'staff@ambouniversity.edu' });
    if (!staffUser) {
      await User.create({
        name: 'Staff Member',
        email: 'staff@ambouniversity.edu',
        password: 'staff123', // Will be hashed automatically
        role: 'Staff'
      });
    }

    // Seed resources
    const resources = [
      { name: 'Laptop Computers', category: 'Electronics', quantity: 45, location: 'Computer Lab', minimum_threshold: 20 },
      { name: 'Projectors', category: 'Electronics', quantity: 12, location: 'Classroom', minimum_threshold: 15 },
      { name: 'Textbooks', category: 'Books', quantity: 8, location: 'Library', minimum_threshold: 10 },
      { name: 'Lab Equipment', category: 'Equipment', quantity: 25, location: 'Lab', minimum_threshold: 15 },
      { name: 'Chairs', category: 'Furniture', quantity: 150, location: 'Classroom', minimum_threshold: 50 },
      { name: 'Tables', category: 'Furniture', quantity: 80, location: 'Classroom', minimum_threshold: 40 },
      { name: 'Whiteboard Markers', category: 'Supplies', quantity: 5, location: 'Classroom', minimum_threshold: 20 },
      { name: 'Cleaning Supplies', category: 'Supplies', quantity: 15, location: 'Cafeteria', minimum_threshold: 25 },
    ];

    for (const resource of resources) {
      const existing = await Resource.findOne({ name: resource.name });
      if (!existing) {
        await Resource.create(resource);
      }
    }

    console.log('✅ Seed data inserted successfully!');
    console.log('\nDemo Users:');
    console.log('Admin: admin@ambouniversity.edu / admin123');
    console.log('Manager: manager@ambouniversity.edu / manager123');
    console.log('Staff: staff@ambouniversity.edu / staff123');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
