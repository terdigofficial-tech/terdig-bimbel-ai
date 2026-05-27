-- FASE 7: Struktur Kelas & Program
-- Jalankan SQL ini di Supabase SQL Editor

-- 1. Buat tabel grades (kelas)
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Buat tabel programs (program pembelajaran)
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tambah kolom di tabel students (nullable, jangan ganggu data lama)
ALTER TABLE students ADD COLUMN IF NOT EXISTS grade_id UUID REFERENCES grades(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES programs(id);

-- 4. Tambah kolom di production_kits untuk kelas target
ALTER TABLE production_kits ADD COLUMN IF NOT EXISTS grade_id UUID REFERENCES grades(id);

-- 5. Isi data awal grades (PAUD/TK + SD)
INSERT INTO grades (name, level) VALUES
  ('PAUD', 0),
  ('TK A', -1),
  ('TK B', -2),
  ('Kelas 1 SD', 1),
  ('Kelas 2 SD', 2),
  ('Kelas 3 SD', 3),
  ('Kelas 4 SD', 4),
  ('Kelas 5 SD', 5),
  ('Kelas 6 SD', 6)
ON CONFLICT DO NOTHING;

-- 6. Isi data awal programs
INSERT INTO programs (name, description) VALUES
  ('Reguler', 'Program reguler'),
  ('Premium', 'Program premium'),
  ('Privat', 'Program privat')
ON CONFLICT DO NOTHING;

-- Verifikasi data
SELECT 'Grades:' as info, COUNT(*) as count FROM grades;
SELECT 'Programs:' as info, COUNT(*) as count FROM programs;
