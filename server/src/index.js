const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

// Trust Railway reverse proxy (enables correct protocol detection via X-Forwarded-Proto)
app.set('trust proxy', 1);

// Middlewares
app.use(cors({
  origin: ['https://alo-bidan-production.up.railway.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// ========================
// AUTHENTICATION
// ========================

// POST Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, hash this!
        phone,
        avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        role: 'patient',
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat akun' });
  }
});

// POST Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat masuk' });
  }
});

// ========================
// HEALTH CHECK
// ========================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend AloBidan is running!' });
});

// ========================
// SERVICES
// ========================
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET Symptoms
app.get('/api/symptoms', async (req, res) => {
  try {
    const symptoms = await prisma.symptom.findMany({
      orderBy: { id: 'asc' }
    });
    // Format to match old local structure
    const formatted = symptoms.map(s => ({ id: s.slug, label: s.label }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch symptoms' });
  }
});

// GET Diseases
app.get('/api/diseases', async (req, res) => {
  try {
    const diseases = await prisma.disease.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(diseases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// ========================
// USERS (Admin Only)
// ========================
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
});

// ========================
// BOOKINGS (Janji Temu)
// ========================

// GET semua booking (optional filter by userId)
app.get('/api/bookings', async (req, res) => {
  try {
    const { userId } = req.query;
    const bookings = await prisma.booking.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data janji temu' });
  }
});

// GET booking berdasarkan nama pasien (query: ?patient=NamaBunda)
app.get('/api/bookings/search', async (req, res) => {
  try {
    const { patient } = req.query;
    const bookings = await prisma.booking.findMany({
      where: patient ? { patientName: { contains: patient, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mencari janji temu' });
  }
});

// GET booking by ID
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { service: true },
    });
    if (!booking) return res.status(404).json({ error: 'Janji temu tidak ditemukan' });
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil detail janji temu' });
  }
});

// POST buat booking baru
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, serviceId, serviceName, serviceSpec, midwifeName, day, time, complaint, price, patientName, patientPhone } = req.body;

    // Validasi field wajib
    if (!serviceId || !serviceName || !day || !time || !patientName) {
      return res.status(400).json({ error: 'Data tidak lengkap. Wajib: serviceId, serviceName, day, time, patientName' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: userId ? parseInt(userId) : null,
        serviceId,
        serviceName,
        serviceSpec: serviceSpec || '',
        midwifeName: midwifeName || 'Eli Hidayati S.Keb',
        day,
        time,
        complaint: complaint || null,
        price: price || 0,
        patientName,
        patientPhone: patientPhone || null,
        status: 'confirmed',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal membuat janji temu' });
  }
});

// PATCH update status booking (konfirmasi/batalkan/selesai)
app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status tidak valid. Pilihan: ${validStatuses.join(', ')}` });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengubah status janji temu' });
  }
});

// DELETE hapus booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Janji temu berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus janji temu' });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server AloBidan is running on port ${PORT}`);
});
