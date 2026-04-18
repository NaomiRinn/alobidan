const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const servicesData = [
  {
    name: 'Cek Kandungan',
    specialization: 'Kesehatan Kehamilan',
    hospital: 'Eli Hidayati S.Keb',
    rating: 5.0,
    reviews: 312,
    experience: '30 mnt',
    price: 150000,
    avatar: '/eli.png',
    initials: 'CK',
    color: '#f472b6',
    available: true,
    schedule: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    about: 'Layanan pemeriksaan kandungan secara komprehensif untuk memantau kesehatan ibu dan janin.',
    education: ['Pemeriksaan TTV', 'Pengukuran LILA', 'Detak Jantung Janin', 'Konsultasi Nutrisi'],
    languages: ['Ibu Hamil'],
  },
  {
    name: 'Rawat Jalan',
    specialization: 'Rawat Jalan',
    hospital: 'Eli Hidayati S.Keb',
    rating: 4.9,
    reviews: 256,
    experience: '20 mnt',
    price: 120000,
    avatar: '/eli.png',
    initials: 'RJ',
    color: '#2dd4bf',
    available: true,
    schedule: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    about: 'Layanan rawat jalan untuk keluhan kesehatan ringan pada perempuan, ibu hamil, bayi, dan balita.',
    education: ['Pemeriksaan Fisik', 'Pemberian Terapi Medis Dasar', 'Resep Obat Ringan'],
    languages: ['Ibu', 'Bayi', 'Anak', 'Dewasa'],
  },
  {
    name: 'Konsultasi Bidan',
    specialization: 'Sistem Reproduksi',
    hospital: 'Eli Hidayati S.Keb',
    rating: 4.8,
    reviews: 198,
    experience: '45 mnt',
    price: 100000,
    avatar: '/eli.png',
    initials: 'KB',
    color: '#fb923c',
    available: true,
    schedule: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    about: 'Layanan konsultasi kesehatan reproduksi, keluarga berencana, ASI, tumbuh kembang anak, dan persiapan persalinan.',
    education: ['Konsultasi KB', 'Edukasi Persalinan', 'Laktasi & MPASI'],
    languages: ['Ibu'],
  },
  {
    name: 'Persalinan',
    specialization: 'Persalinan',
    hospital: 'Eli Hidayati S.Keb',
    rating: 5.0,
    reviews: 145,
    experience: '24 Jam',
    price: 1500000,
    avatar: '/eli.png',
    initials: 'PR',
    color: '#f43f5e',
    available: true,
    schedule: ['24 Jam Standby'],
    about: 'Layanan penanganan persalinan normal pro-vaginam dengan asuhan sayang ibu serta fasilitas observasi pasca salin yang nyaman.',
    education: ['Persalinan Normal', 'Penjahitan Perineum', 'Inisiasi Menyusu Dini (IMD)'],
    languages: ['Ibu', 'Bapak'],
  },
];

const symptomsData = [
  { slug: 'mual', label: 'Mual / Muntah' },
  { slug: 'flek', label: 'Flek / Bercak Darah' },
  { slug: 'kram_perut', label: 'Kram / Nyeri Perut' },
  { slug: 'pusing', label: 'Pusing / Berkunang' },
  { slug: 'bengkak', label: 'Kaki / Tangan Bengkak' },
  { slug: 'demam', label: 'Demam' },
  { slug: 'lemas', label: 'Sangat Lemas / Lelah' },
  { slug: 'keputihan', label: 'Keputihan Gatal/Berbau' },
  { slug: 'kontraksi', label: 'Perut Kencang / Kontraksi' },
  { slug: 'gerak_janin', label: 'Gerak Janin Berkurang' },
];

const diseasesData = [
  {
    name: 'Morning Sickness (Emesis Gravidarum)',
    severity: 'ringan',
    symptoms: ['mual', 'lemas', 'pusing'],
    requiredSymptoms: ['mual'],
    description: 'Mual muntah yang umum terjadi pada kehamilan trimester pertama akibat perubahan hormon hCG.',
    recommendation: 'Makan porsi kecil tapi sering (tiap 2 jam). Hindari makanan berbau tajam/berlemak. Minum air jahe hangat. Segera ke Bidan jika tidak ada makanan/minuman yang masuk sama sekali (Hiperemesis).',
    specialist: 'Bidan',
    urgency: 'normal',
  },
  {
    name: 'Ancaman Keguguran (Abortus Iminens)',
    severity: 'sedang',
    symptoms: ['flek', 'kram_perut', 'lemas'],
    requiredSymptoms: ['flek'],
    description: 'Bercak darah disertai kram perut pada usia kehamilan kurang dari 20 minggu bisa menjadi tanda ancaman keguguran.',
    recommendation: 'Lakukan bed rest (istirahat total) segera! Kurangi aktivitas fisik dan hubungi Bidan/Dokter Kandungan untuk USG dan pemeriksaan detak jantung janin.',
    specialist: 'Bidan / Spesialis Kandungan',
    urgency: 'segera',
  },
  {
    name: 'Tanda Preeklampsia (Keracunan Kehamilan)',
    severity: 'parah',
    symptoms: ['bengkak', 'pusing', 'mual'],
    requiredSymptoms: ['bengkak', 'pusing'],
    description: 'Komplikasi kehamilan yang ditandai dengan tekanan darah tinggi dan pembengkakan ekstremitas, biasanya terjadi setelah usia kehamilan 20 minggu.',
    recommendation: 'SEGERA periksakan ke klinik keluhan pusing hebat dan kaki/tangan bengkak. Ini memerlukan cek tensi dan cek protein urine secepatnya!',
    specialist: 'Bidan',
    urgency: 'darurat',
  },
  {
    name: 'Anemia Kehamilan',
    severity: 'sedang',
    symptoms: ['pusing', 'lemas', 'mual'],
    requiredSymptoms: ['lemas', 'pusing'],
    description: 'Kekurangan sel darah merah yang sering terjadi pada kehamilan karena peningkatan kebutuhan zat besi untuk janin.',
    recommendation: 'Konsumsi makanan kaya zat besi (bayam, daging merah, hati ayam). Pastikan meminum tablet tambah darah (Fe) yang diberikan Bidan bersama air jeruk/vitamin C.',
    specialist: 'Bidan',
    urgency: 'normal',
  },
  {
    name: 'Infeksi / Candidiasis Vagina',
    severity: 'ringan',
    symptoms: ['keputihan', 'kram_perut'],
    requiredSymptoms: ['keputihan'],
    description: 'Keputihan yang tidak normal (gatal, berbau, berwarna kehijauan/kekuningan) disebabkan oleh jamur atau bakteri selama kehamilan.',
    recommendation: 'Jaga kebersihan area intim. Gunakan pakaian dalam katun. Segera konsultasikan ke Bidan untuk mendapatkan pengobatan ovula/salep yang aman untuk kehamilan.',
    specialist: 'Bidan',
    urgency: 'normal',
  },
  {
    name: 'Tanda Persalinan / Ancaman Prematur',
    severity: 'sedang',
    symptoms: ['kontraksi', 'kram_perut', 'flek'],
    requiredSymptoms: ['kontraksi'],
    description: 'Perut terasa kencang/mulas secara teratur. Jika terjadi sebelum 37 minggu, ini adalah ancaman prematur.',
    recommendation: 'Hitung durasi dan frekuensi kontraksi. Jika terjadi tiap 10 menit atau disertai keluar lendir darah/air ketuban, SEGERA ke Bidan/Faskes bersalin!',
    specialist: 'Bidan',
    urgency: 'segera',
  },
  {
    name: 'Gawat Janin (Fetal Distress)',
    severity: 'parah',
    symptoms: ['gerak_janin'],
    requiredSymptoms: ['gerak_janin'],
    description: 'Penurunan signifikan atau hilangnya gerakan janin (kurang dari 10 gerakan dalam 12 jam) pada trimester tiga.',
    recommendation: 'Rangsang janin dengan minum air dingin/manis dan berbaring miring ke kiri. Jika belum ada gerakan dalam 1 jam, SEGERA ke RS/Bidan untuk CTG dan Doppler!',
    specialist: 'Bidan / Spesialis Kandungan',
    urgency: 'darurat',
  },
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data (bookings first due to FK)
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.disease.deleteMany();
  console.log('Cleared old data.');

  // Create Services
  for (const service of servicesData) {
    await prisma.service.create({ data: service });
  }
  console.log('Seeded', servicesData.length, 'services.');

  // Create Symptoms
  for (const symptom of symptomsData) {
    await prisma.symptom.create({ data: symptom });
  }
  console.log('Seeded', symptomsData.length, 'symptoms.');

  // Create Diseases
  for (const disease of diseasesData) {
    await prisma.disease.create({ data: disease });
  }
  console.log('Seeded', diseasesData.length, 'diseases.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
