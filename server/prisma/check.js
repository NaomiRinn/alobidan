require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL });

async function main() {
  const sCount = await prisma.service.count();
  const aCount = await prisma.article.count();
  console.log('Services in DB:', sCount);
  console.log('Articles in DB:', aCount);

  const services = await prisma.service.findMany({ select: { id: true, name: true } });
  console.log('Services:', services);
}

main().catch(console.error).finally(() => prisma.$disconnect());
