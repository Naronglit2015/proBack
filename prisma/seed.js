const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const password = bcrypt.hashSync('123456');

const userData = [
  { username: 'andy', password, email: 'andy@ggg.mail' },
  { username: 'bobby', password, email: 'bobby@ggg.mail' },
  { username: 'candy', password, email: 'candy@ggg.mail' },
];

const productData = [
  { name: 'Product 1', description: 'Description of Product 1', price: 10.99 },
  { name: 'Product 2', description: 'Description of Product 2', price: 19.99 },
  { name: 'Product 3', description: 'Description of Product 3', price: 15.49 },
];

const run = async () => {
  try {
    await prisma.user.deleteMany({}); // Delete all existing users
    await prisma.product.deleteMany({}); // Delete all existing products

    // Create new users
    await prisma.user.createMany({
      data: userData,
    });

    // Create new products
    await prisma.product.createMany({
      data: productData,
    });

    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

run();
