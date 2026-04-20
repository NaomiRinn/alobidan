const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users in DB:');
  users.forEach(u => {
    console.log(`- ${u.name} (${u.email}) [${u.role}] - Password: ${u.password}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
