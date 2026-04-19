# 📖 PANDUAN INSTALASI LENGKAP — MASJID APP
## Aplikasi Website Masjid (PWA - Bisa Diinstall di Android)

---

## 🏗️ GAMBARAN ARSITEKTUR

```
Masjid App
├── Frontend  : React + Vite (PWA - bisa install di Android)
├── Database  : Supabase (PostgreSQL gratis)
├── Hosting   : Vercel (gratis)
└── PWA       : Service Worker — bisa diinstall dari Chrome/Browser
```

---

## 📋 LANGKAH 1 — PERSIAPAN TOOLS

Install tools berikut di laptop/komputer Anda:

### 1a. Install Node.js
1. Buka https://nodejs.org
2. Download versi **LTS (Long Term Support)**
3. Install dengan klik Next → Next → Finish
4. Cek: buka Terminal/CMD, ketik `node --version` → harus muncul angka

### 1b. Install Git
1. Buka https://git-scm.com/downloads
2. Download dan install untuk OS Anda
3. Cek: ketik `git --version` di terminal

### 1c. Install VS Code (editor kode, opsional tapi direkomendasikan)
1. Buka https://code.visualstudio.com
2. Download dan install

---

## 🗄️ LANGKAH 2 — SETUP SUPABASE (Database Gratis)

Supabase adalah database PostgreSQL yang bisa digunakan gratis.

### 2a. Buat Akun Supabase
1. Buka https://supabase.com
2. Klik **Start your project** → Login dengan GitHub
3. Klik **New project**
4. Isi:
   - **Name**: `masjid-app` (atau nama bebas)
   - **Database Password**: buat password yang kuat (simpan!)
   - **Region**: pilih `Southeast Asia (Singapore)`
5. Klik **Create new project** — tunggu ~2 menit

### 2b. Buat Tabel Database
1. Di Supabase dashboard, klik **SQL Editor** (ikon play di sidebar kiri)
2. Klik **New query**
3. Buka file `supabase-schema.sql` dari folder proyek ini
4. **Copy semua isi file** dan paste ke SQL Editor
5. Klik tombol **Run** (atau Ctrl+Enter)
6. Pastikan muncul "Success" — semua tabel sudah terbuat ✅

### 2c. Buat Akun Admin Pengurus
1. Di sidebar Supabase, klik **Authentication** → **Users**
2. Klik **Add user** → **Create new user**
3. Isi:
   - **Email**: `admin@masjid.id` (ganti sesuai keinginan)
   - **Password**: password Anda
4. Klik **Create user** ✅

### 2d. Ambil API Keys
1. Di sidebar, klik **Settings** (ikon gear) → **API**
2. Catat dua informasi ini:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOi...` (panjang)

---

## 💻 LANGKAH 3 — SETUP KODE PROYEK

### 3a. Extract/Buka Folder Proyek
Pastikan Anda sudah mengekstrak folder `masjid-app` di komputer Anda.

### 3b. Buat File Environment
1. Di dalam folder `masjid-app`, cari file `.env.example`
2. **Duplikat file tersebut** dan rename menjadi `.env.local`
3. Buka `.env.local` dengan text editor, isi:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

> ⚠️ Ganti `xxxxxxxxxx` dengan URL dan key yang Anda catat dari Supabase!

### 3c. Install Dependencies & Jalankan
Buka Terminal/CMD di dalam folder `masjid-app`:

```bash
# Masuk ke folder proyek
cd masjid-app

# Install semua package yang dibutuhkan
npm install

# Jalankan aplikasi di mode development
npm run dev
```

4. Buka browser, pergi ke: **http://localhost:5173**
5. Website masjid sudah bisa dilihat! 🎉

---

## 🚀 LANGKAH 4 — DEPLOY KE VERCEL (Hosting Gratis)

### 4a. Buat Akun Vercel
1. Buka https://vercel.com
2. Klik **Sign Up** → login dengan GitHub
3. (Jika belum punya GitHub, buat dulu di https://github.com)

### 4b. Upload Kode ke GitHub
```bash
# Di dalam folder masjid-app, jalankan:
git init
git add .
git commit -m "Initial masjid app"

# Buat repository baru di GitHub (https://github.com/new)
# Lalu jalankan perintah yang diberikan GitHub, contoh:
git remote add origin https://github.com/username/masjid-app.git
git push -u origin main
```

### 4c. Deploy di Vercel
1. Buka https://vercel.com/dashboard
2. Klik **Add New → Project**
3. Pilih repository `masjid-app` dari GitHub Anda
4. Klik **Import**
5. Di bagian **Environment Variables**, tambahkan:
   - Key: `VITE_SUPABASE_URL` → Value: URL Supabase Anda
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: Anon key Supabase Anda
6. Klik **Deploy** — tunggu ~2 menit
7. Website Anda akan live di URL seperti: `https://masjid-app-xxx.vercel.app` 🌐

---

## 📱 LANGKAH 5 — INSTALL DI ANDROID (PWA)

Karena aplikasi ini adalah PWA (Progressive Web App), bisa diinstall langsung di Android tanpa App Store!

### Cara Install di Android:
1. Buka **Chrome** di HP Android Anda
2. Pergi ke URL website Anda (dari Vercel)
3. Tunggu beberapa detik sampai website load sempurna
4. Chrome akan menampilkan **banner "Add to Home Screen"** secara otomatis
   - Jika tidak muncul: ketuk **ikon ⋮** (tiga titik) di pojok kanan atas
   - Pilih **"Add to Home screen"** atau **"Install App"**
5. Ketuk **Install** / **Add**
6. Ikon aplikasi akan muncul di layar utama Android Anda ✅

### Setelah diinstall:
- App bisa dibuka seperti aplikasi biasa
- Tampilannya fullscreen, tanpa bar URL browser
- Bisa berjalan meski sinyal lemah (cache offline)

---

## ⚙️ LANGKAH 6 — KONFIGURASI AWAL MASJID

Setelah website live, isi informasi masjid Anda:

1. Buka `https://website-anda.vercel.app/login`
2. Login dengan email dan password yang dibuat di Langkah 2c
3. Di panel admin, pilih menu **Info Masjid**
4. Isi semua informasi: nama, alamat, rekening, koordinat, dll.
5. Klik **Simpan Info Masjid**
6. Tambahkan **Pengurus** dengan foto (gunakan link Google Drive/Imgur)
7. Tambahkan **Agenda** kegiatan masjid
8. Mulai catat **Pemasukan** dan **Pengeluaran** harian
9. Buat **Laporan Infaq** bulanan untuk tampilan publik

---

## 🌍 CARA MENDAPATKAN KOORDINAT MASJID

Agar waktu sholat akurat, masukkan koordinat lokasi masjid:

1. Buka Google Maps di HP
2. Cari lokasi masjid Anda
3. Tap dan tahan di titik masjid
4. Koordinat akan muncul di bawah (contoh: `-7.258, 112.752`)
5. Masukkan ke kolom **Latitude** dan **Longitude** di Info Masjid

---

## 🔧 TROUBLESHOOTING

### ❌ "npm install" error
```bash
# Coba hapus cache npm lalu install ulang
npm cache clean --force
npm install
```

### ❌ Database tidak tersambung
- Pastikan `.env.local` ada dan isinya benar
- Cek URL dan key Supabase tidak ada spasi/terpotong
- Cek di Supabase: Settings → API → pastikan key sama

### ❌ Login admin tidak bisa masuk
- Pastikan user sudah dibuat di Supabase → Authentication → Users
- Reset password jika lupa: di Supabase → Authentication → Users → Send password reset

### ❌ Website tidak bisa diinstall di Android
- Pastikan diakses lewat HTTPS (Vercel otomatis HTTPS)
- Gunakan Chrome versi terbaru
- Coba buka di incognito mode, lalu install

### ❌ Waktu sholat tidak akurat
- Pastikan koordinat (lat/lng) sudah diisi dengan benar di Info Masjid
- Default koordinat adalah Surabaya (-7.2575, 112.7521)

---

## 💰 BIAYA

| Layanan | Biaya |
|---------|-------|
| Supabase (Free tier) | Gratis (500MB database, 2GB bandwidth/bulan) |
| Vercel (Hobby) | Gratis (deployment unlimited) |
| Domain custom | Opsional, ~Rp 100-200rb/tahun |
| **TOTAL** | **Rp 0** (untuk masjid kecil-menengah) |

---

## 📞 STRUKTUR FILE PROYEK

```
masjid-app/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx    ← Halaman publik utama
│   │   ├── LoginPage.jsx      ← Halaman login pengurus
│   │   └── Dashboard.jsx      ← Panel admin lengkap
│   ├── components/            ← Komponen tambahan
│   ├── hooks/
│   │   └── usePrayerTimes.js  ← Kalkulasi waktu sholat
│   ├── lib/
│   │   └── supabase.js        ← Koneksi database
│   ├── context/
│   │   └── AuthContext.jsx    ← Manajemen login
│   └── styles/
│       ├── global.css         ← Style umum
│       └── landing.css        ← Style landing page
├── .env.example               ← Template environment variables
├── .env.local                 ← ⚠️ BUAT SENDIRI, isi API keys
├── supabase-schema.sql        ← Script buat database
├── vercel.json                ← Konfigurasi Vercel
├── vite.config.js             ← Konfigurasi build + PWA
└── package.json               ← Daftar dependencies
```

---

## 🤲 Jazakallahu Khairan
Semoga aplikasi ini bermanfaat untuk kemakmuran masjid dan umat Islam.
