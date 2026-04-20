# 📖 PANDUAN INSTALASI — MASJID APP
### Aplikasi Website Masjid Modern (PWA — Bisa Diinstall di Android)

---

## 🏗️ GAMBARAN APLIKASI

Masjid App adalah aplikasi website modern untuk masjid yang dilengkapi:

- **Landing Page** — Waktu sholat otomatis, pengurus, agenda, jadwal imam & khatib, laporan infaq, tausiyah, dan info masjid
- **Panel Admin** — Kelola semua konten, keuangan pemasukan & pengeluaran, dan pilihan tema warna
- **PWA** — Bisa diinstall di Android seperti aplikasi native
- **Firebase** — Database realtime gratis, tidak pause meski tidak aktif berbulan-bulan

```
Stack Teknologi:
├── Frontend  : React + Vite (PWA)
├── Database  : Firebase Firestore
├── Auth      : Firebase Authentication
├── Hosting   : Vercel (gratis)
└── Android   : PWA — install langsung dari Chrome
```

---

## 📋 LANGKAH 1 — PERSIAPAN TOOLS

Install tools berikut di komputer/laptop Anda:

### Node.js
1. Buka https://nodejs.org
2. Download versi **LTS**
3. Install → Next → Next → Finish
4. Cek: buka Terminal/CMD → ketik `node --version`

### Git
1. Buka https://git-scm.com/downloads
2. Download dan install
3. Cek: ketik `git --version` di terminal

### VS Code (opsional, direkomendasikan)
1. Buka https://code.visualstudio.com
2. Download dan install

---

## 🔥 LANGKAH 2 — SETUP FIREBASE

### 2a. Buat Project Firebase
1. Buka https://console.firebase.google.com
2. Login dengan akun Google
3. Klik **Add project**
4. Isi nama project: `masjid-app` (atau nama bebas)
5. **Nonaktifkan** Google Analytics (tidak perlu)
6. Klik **Create project** — tunggu selesai

### 2b. Aktifkan Firestore Database
1. Di sidebar kiri klik **Firestore Database**
2. Klik **Create database**
3. Pilih **Start in production mode**
4. Pilih region: **asia-southeast1 (Singapore)**
5. Klik **Enable**

### 2c. Set Firestore Rules
1. Masih di Firestore, klik tab **Rules**
2. Hapus semua isi yang ada
3. Copy dan paste rules berikut:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pengurus/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /agenda/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /jadwal_imam/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /tausiyah/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /laporan_infaq/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pemasukan/{doc} {
      allow read, write: if request.auth != null;
    }
    match /pengeluaran/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Klik **Publish**

### 2d. Aktifkan Authentication
1. Di sidebar klik **Authentication**
2. Klik **Get started**
3. Pilih **Email/Password**
4. Toggle **Enable** → klik **Save**

### 2e. Buat Akun Admin
1. Masih di Authentication, klik tab **Users**
2. Klik **Add user**
3. Isi:
   - Email: `admin@masjid-anda.id` (ganti sesuai keinginan)
   - Password: password yang kuat (min. 8 karakter)
4. Klik **Add user**

### 2f. Ambil Firebase Config
1. Klik ikon ⚙️ **Project Settings** (pojok kiri atas)
2. Scroll ke bagian **Your apps**
3. Klik ikon **</>** (Web)
4. Isi nama app: `masjid-web`
5. Klik **Register app**
6. Salin semua nilai config — akan dipakai di Langkah 4

Config yang perlu disalin:
```
apiKey: "AIzaSy..."
authDomain: "nama-project.firebaseapp.com"
projectId: "nama-project"
storageBucket: "nama-project.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:xxxxx"
```

---

## 💻 LANGKAH 3 — SETUP KODE

### 3a. Extract Folder Proyek
1. Extract file `masjid-app.zip` ke lokasi yang diinginkan
2. Masuk ke folder hasil extract: `masjid-app`

### 3b. Buat File Environment
1. Di dalam folder `masjid-app`, buat file baru bernama **`.env.local`**
   > ⚠️ Nama filenya `.env.local` — bukan `.env.example`
2. Isi file tersebut dengan config Firebase dari Langkah 2f:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nama-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-project
VITE_FIREBASE_STORAGE_BUCKET=nama-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

3. Simpan file

### 3c. Install & Jalankan Lokal
Buka Terminal/CMD di dalam folder `masjid-app`:

```bash
npm install
npm run dev
```

Buka browser → pergi ke **http://localhost:5173**

Website masjid sudah bisa dilihat! ✅

---

## 🚀 LANGKAH 4 — DEPLOY KE VERCEL

### 4a. Buat Akun GitHub
1. Buka https://github.com
2. Daftar akun (jika belum punya)

### 4b. Buat Personal Access Token GitHub
1. Buka https://github.com/settings/tokens
2. Klik **Generate new token (classic)**
3. Isi:
   - Note: `masjid-app`
   - Expiration: `No expiration`
   - Centang: ✅ `repo`
4. Klik **Generate token**
5. **Salin tokennya sekarang** — hanya tampil sekali!

### 4c. Upload ke GitHub
Buka Terminal di folder `masjid-app`:

```bash
git init
git add .
git commit -m "Initial commit masjid app"
git branch -M master
git remote add origin https://TOKEN@github.com/username/masjid-app.git
git push -u origin master
```

> Ganti `TOKEN` dengan token dari langkah 4b
> Ganti `username` dengan username GitHub Anda

### 4d. Buat Akun Vercel
1. Buka https://vercel.com
2. Klik **Sign Up** → login dengan GitHub

### 4e. Deploy
1. Di Vercel dashboard klik **Add New → Project**
2. Pilih repository `masjid-app` → klik **Import**
3. Di bagian **Framework Preset** → pilih **Vite**
4. Buka bagian **Environment Variables** → tambahkan semua variable dari `.env.local`:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `nama-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `nama-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `nama-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:xxxxx` |

5. Klik **Deploy** — tunggu 2-3 menit
6. Website Anda live di URL seperti: `https://masjid-app-xxx.vercel.app` 🌐

---

## 📱 LANGKAH 5 — INSTALL DI ANDROID (PWA)

Aplikasi ini bisa diinstall di Android **tanpa App Store!**

1. Buka **Chrome** di HP Android
2. Buka URL website Vercel Anda
3. Tunggu website load sempurna
4. Ketuk ikon **⋮** (tiga titik) di pojok kanan atas Chrome
5. Pilih **"Add to Home screen"** atau **"Install App"**
6. Ketuk **Install**
7. Ikon aplikasi muncul di layar utama ✅

Setelah diinstall:
- Tampil fullscreen seperti aplikasi native
- Bisa dibuka meski sinyal lemah (cache offline)
- Tidak perlu browser lagi

---

## ⚙️ LANGKAH 6 — KONFIGURASI MASJID

Setelah website live, masukkan data masjid Anda:

1. Buka `https://website-anda.vercel.app/login`
2. Login dengan email & password yang dibuat di Langkah 2e
3. Isi semua menu di panel admin:

| Menu | Keterangan |
|------|------------|
| **Info Masjid** | Nama, alamat, rekening, QRIS, koordinat, tema warna |
| **Pengurus** | Foto dan jabatan dewan pengurus |
| **Agenda** | Jadwal kegiatan masjid |
| **Jadwal Imam** | Imam & khatib Jumat/Idul Fitri/Idul Adha |
| **Tausiyah** | Artikel tausiyah |
| **Laporan Infaq** | Ringkasan keuangan bulanan untuk publik |
| **Pemasukan** | Catat detail pemasukan harian |
| **Pengeluaran** | Catat detail pengeluaran harian |

---

## 🌍 CARA MENDAPAT KOORDINAT MASJID

Agar waktu sholat akurat:

1. Buka **Google Maps**
2. Cari lokasi masjid Anda
3. Tap dan tahan di titik masjid
4. Koordinat muncul di bawah, contoh: `-7.258, 112.752`
5. Angka pertama = **Latitude**, angka kedua = **Longitude**
6. Masukkan ke kolom Latitude & Longitude di **Info Masjid**

---

## 🖼️ CARA UPLOAD FOTO (Logo, Pengurus, QRIS, dll)

Aplikasi menggunakan URL gambar dari internet. Pilihan hosting gambar gratis:

### Opsi A — Imgur (Paling Mudah)
1. Buka https://imgur.com → login
2. Klik **New Post** → upload foto
3. Klik foto → klik kanan → **Copy image address**
4. URL seperti: `https://i.imgur.com/xxxxxxx.jpg`

### Opsi B — Google Drive
1. Upload foto ke Google Drive
2. Klik kanan → **Share** → **Anyone with the link**
3. Copy link, ambil bagian **ID**: `https://drive.google.com/file/d/`**`ID_INI`**`/view`
4. Konversi jadi: `https://drive.google.com/uc?export=view&id=ID_INI`

### Opsi C — Supabase Storage
1. Di Supabase → **Storage** → **New bucket** → nama: `images` → centang **Public**
2. Upload foto → copy URL

---

## 🎨 CARA GANTI TEMA WARNA

1. Login admin → **Info Masjid**
2. Scroll ke bagian **Tema Warna Website**
3. Pilih dari 7 tema:
   - 🟢 Hijau Emerald
   - 🔵 Biru Royal
   - 🟤 Coklat Emas
   - 🟣 Ungu Maroon
   - ⚫ Hitam Elegan
   - 🔴 Merah Burgundy
   - 🩵 Biru Teal
4. Klik **Simpan Info Masjid**

---

## 💰 BIAYA

| Layanan | Biaya |
|---------|-------|
| Firebase (Spark/Free) | **Gratis** — 1GB database, 50K baca/hari |
| Vercel (Hobby) | **Gratis** — unlimited deployment |
| GitHub | **Gratis** |
| Domain custom (opsional) | ~Rp 100.000–200.000/tahun |
| **Total** | **Rp 0** untuk masjid kecil-menengah |

---

## 🔧 TROUBLESHOOTING

### ❌ npm install error
```bash
npm cache clean --force
npm install
```

### ❌ Firebase error "Missing or insufficient permissions"
- Pastikan **Firestore Rules** sudah di-publish (Langkah 2c)
- Pastikan sudah **login** di panel admin sebelum input data

### ❌ Data tidak muncul di landing page
- Pastikan Firestore Rules mengizinkan `read: if true` untuk koleksi publik
- Cek browser Console (F12) untuk pesan error

### ❌ Login admin gagal
- Pastikan user sudah dibuat di Firebase → Authentication → Users
- Reset password: Firebase → Authentication → Users → klik user → Reset password

### ❌ Waktu sholat tidak akurat
- Isi koordinat Latitude & Longitude yang benar di Info Masjid
- Default koordinat adalah Surabaya (-7.2575, 112.7521)

### ❌ Website tidak bisa diinstall di Android
- Pastikan diakses lewat **HTTPS** (Vercel otomatis HTTPS)
- Gunakan **Chrome** versi terbaru
- Coba buka di mode incognito lalu install

### ❌ Build error di Vercel
- Pastikan **Framework Preset** di Vercel diset ke **Vite** (bukan Next.js)
- Pastikan semua **Environment Variables** sudah diisi dengan benar

---

## 📁 STRUKTUR FILE PROYEK

```
masjid-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── context/
│   │   └── AuthContext.jsx       ← Manajemen login
│   ├── hooks/
│   │   └── usePrayerTimes.js     ← Hitung waktu sholat otomatis
│   ├── lib/
│   │   └── firebase.js           ← Koneksi Firebase & semua fungsi data
│   ├── pages/
│   │   ├── LandingPage.jsx       ← Halaman publik utama
│   │   ├── LoginPage.jsx         ← Halaman login pengurus
│   │   └── Dashboard.jsx         ← Panel admin lengkap
│   ├── styles/
│   │   ├── global.css            ← Style global + tema warna
│   │   └── landing.css           ← Style landing page
│   ├── App.jsx                   ← Router utama
│   └── main.jsx                  ← Entry point
├── .env.example                  ← Template environment variables
├── .env.local                    ← ⚠️ Buat sendiri, isi Firebase config
├── .npmrc                        ← Konfigurasi npm
├── index.html                    ← HTML utama
├── package.json                  ← Dependencies
├── vercel.json                   ← Konfigurasi Vercel
└── vite.config.js                ← Konfigurasi build + PWA
```

---

## 🤲 Penutup

Semoga aplikasi ini bermanfaat untuk kemakmuran masjid dan mempererat ukhuwah Islamiyah.

**Jazakallahu Khairan Katsiran** — Semoga Allah membalas kebaikan Anda dengan kebaikan yang berlipat ganda.

> *"Sesungguhnya yang memakmurkan masjid-masjid Allah hanyalah orang yang beriman kepada Allah dan hari kemudian"* — (QS. At-Taubah: 18)
