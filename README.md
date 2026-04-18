# 🤰 AloBidan - Klinik Kebidanan Digital

AloBidan adalah platform layanan kebidanan digital yang membantu Bunda memantau kesehatan kehamilan, cek keluhan secara mandiri, dan membuat janji temu dengan bidan secara praktis.

## 🚀 Fitur Utama
- **Pilihan Layanan**: Booking jasa kebidanan (ANC, Imunisasi, KB, dll).
- **Cek Keluhan**: Analisis mandiri berbasis data medis awal untuk keluhan kehamilan.
- **Buku KIA Digital**: Catatan janji temu dan riwayat kesehatan.
- **Admin Dashboard**: Manajemen layanan dan pemantauan kunjungan pasien.

## 🛠️ Tech Stack
- **Frontend**: React 19 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma 7

## 📦 Instalasi Lokal

### 1. Persiapan Database
- Pastikan PostgreSQL sudah terpasal di komputer Bunda.
- Buat file `server/.env` dan isi `DATABASE_URL`.

### 2. Setup Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

### 3. Setup Frontend
```bash
# Buka terminal baru di root folder
npm install
npm run dev
```

## 🌐 Deployment (Railway)
1. Hubungkan repo ini ke Railway.
2. Tambahkan layanan **PostgreSQL**.
3. Deploy folder `server` sebagai backend (set `DATABASE_URL` dan `FRONTEND_URL`).
4. Deploy root folder sebagai frontend (set `VITE_API_URL` ke URL backend).
