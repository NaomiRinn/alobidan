const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'bidan@alobidan.com';
  const adminPassword = 'password_bidan_123';
  
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    // Ensure it has the admin role
    if (existing.role !== 'admin') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      });
      console.log('Updated role to admin for:', adminEmail);
    }
  } else {
    const admin = await prisma.user.create({
      data: {
        name: 'Bidan Eli',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        avatar: 'BE'
      }
    });
    console.log('Created admin user:');
    console.log(`- Email: ${admin.email}`);
    console.log(`- Password: ${adminPassword}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
