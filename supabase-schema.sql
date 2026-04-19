-- ================================================================
-- SKEMA DATABASE MASJID APP - Supabase PostgreSQL
-- Jalankan query ini di Supabase > SQL Editor > New Query
-- ================================================================

-- 1. Informasi Masjid
CREATE TABLE IF NOT EXISTS mosque_info (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  nama            TEXT DEFAULT 'Masjid Al-Ikhlas',
  tagline         TEXT DEFAULT 'Memakmurkan Masjid, Mempererat Ukhuwah',
  alamat          TEXT,
  telepon         TEXT,
  email           TEXT,
  no_rekening     TEXT,
  bank            TEXT,
  atas_nama       TEXT,
  lat             FLOAT DEFAULT -7.2575,
  lng             FLOAT DEFAULT 112.7521,
  logo_url        TEXT,
  hero_url        TEXT,
  ayat            TEXT,
  terjemah_ayat   TEXT,
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Insert default row
INSERT INTO mosque_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 2. Konfigurasi Waktu Sholat
CREATE TABLE IF NOT EXISTS prayer_config (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  lat             FLOAT DEFAULT -7.2575,
  lng             FLOAT DEFAULT 112.7521,
  metode          TEXT DEFAULT 'MoonsightingCommittee',
  updated_at      TIMESTAMP DEFAULT NOW()
);
INSERT INTO prayer_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. Pengurus
CREATE TABLE IF NOT EXISTS pengurus (
  id              SERIAL PRIMARY KEY,
  nama            TEXT NOT NULL,
  jabatan         TEXT NOT NULL,
  foto_url        TEXT,
  urutan          INTEGER DEFAULT 1,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 4. Agenda
CREATE TABLE IF NOT EXISTS agenda (
  id              SERIAL PRIMARY KEY,
  judul           TEXT NOT NULL,
  deskripsi       TEXT,
  tanggal         DATE NOT NULL,
  waktu           TIME,
  tempat          TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 5. Tausiyah
CREATE TABLE IF NOT EXISTS tausiyah (
  id              SERIAL PRIMARY KEY,
  judul           TEXT NOT NULL,
  penceramah      TEXT,
  isi             TEXT,
  tanggal         DATE NOT NULL,
  thumbnail_url   TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 6. Pemasukan (detail keuangan)
CREATE TABLE IF NOT EXISTS pemasukan (
  id              SERIAL PRIMARY KEY,
  keterangan      TEXT NOT NULL,
  jumlah          BIGINT NOT NULL DEFAULT 0,
  kategori        TEXT,
  tanggal         DATE NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 7. Pengeluaran (detail keuangan)
CREATE TABLE IF NOT EXISTS pengeluaran (
  id              SERIAL PRIMARY KEY,
  keterangan      TEXT NOT NULL,
  jumlah          BIGINT NOT NULL DEFAULT 0,
  kategori        TEXT,
  tanggal         DATE NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 8. Laporan Infaq (ringkasan untuk publik)
CREATE TABLE IF NOT EXISTS laporan_infaq (
  id              SERIAL PRIMARY KEY,
  periode         TEXT NOT NULL,
  total_pemasukan BIGINT DEFAULT 0,
  total_pengeluaran BIGINT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik bisa baca; hanya yang login bisa edit
-- ================================================================

ALTER TABLE mosque_info      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengurus         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tausiyah         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pemasukan        ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengeluaran      ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_infaq    ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa SELECT
CREATE POLICY "public_read_mosque_info"   ON mosque_info    FOR SELECT USING (true);
CREATE POLICY "public_read_prayer_config" ON prayer_config  FOR SELECT USING (true);
CREATE POLICY "public_read_pengurus"      ON pengurus       FOR SELECT USING (true);
CREATE POLICY "public_read_agenda"        ON agenda         FOR SELECT USING (true);
CREATE POLICY "public_read_tausiyah"      ON tausiyah       FOR SELECT USING (true);
CREATE POLICY "public_read_laporan"       ON laporan_infaq  FOR SELECT USING (true);

-- Policy: hanya authenticated user yang bisa INSERT/UPDATE/DELETE
CREATE POLICY "auth_write_mosque_info"    ON mosque_info    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_prayer_config"  ON prayer_config  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_pengurus"       ON pengurus       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_agenda"         ON agenda         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_tausiyah"       ON tausiyah       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_pemasukan"      ON pemasukan      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_pengeluaran"    ON pengeluaran    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_laporan"        ON laporan_infaq  FOR ALL USING (auth.role() = 'authenticated');

-- Pemasukan dan pengeluaran: publik bisa lihat (opsional - hapus kalau mau private)
CREATE POLICY "public_read_pemasukan"     ON pemasukan      FOR SELECT USING (true);
CREATE POLICY "public_read_pengeluaran"   ON pengeluaran    FOR SELECT USING (true);

-- ================================================================
-- DATA CONTOH (opsional, hapus kalau tidak perlu)
-- ================================================================
INSERT INTO pengurus (nama, jabatan, urutan) VALUES
  ('H. Ahmad Fauzi, M.Ag', 'Ketua Takmir', 1),
  ('Drs. Muhammad Ridwan', 'Wakil Ketua', 2),
  ('Hj. Siti Aminah, S.Pd', 'Sekretaris', 3),
  ('Ir. Bambang Santoso', 'Bendahara', 4),
  ('Ustadz Yusuf Rahman', 'Sie Ibadah', 5),
  ('Bapak Hendra Wijaya', 'Sie Kebersihan', 6);

INSERT INTO agenda (judul, deskripsi, tanggal, waktu, tempat) VALUES
  ('Kajian Rutin Ahad', 'Kajian kitab Riyadhus Shalihin', '2025-04-20', '07:00', 'Masjid Al-Ikhlas'),
  ('Sholat Jumat Berjamaah', 'Khutbah Jumat oleh Ust. Yusuf Rahman', '2025-04-18', '11:30', 'Masjid Al-Ikhlas'),
  ('Peringatan Isra Miraj', 'Pengajian akbar dalam rangka Isra Miraj', '2025-04-27', '18:30', 'Masjid Al-Ikhlas');

INSERT INTO laporan_infaq (periode, total_pemasukan, total_pengeluaran) VALUES
  ('Maret 2025', 12500000, 8750000),
  ('Februari 2025', 10800000, 7200000),
  ('Januari 2025', 11200000, 9100000);
