// Satu sumber schema runtime; perubahan berikutnya ditambahkan sebagai migrasi.
export const schemaSql = `
  CREATE TABLE IF NOT EXISTS warga (
    id TEXT PRIMARY KEY, nik TEXT NOT NULL UNIQUE, no_kk TEXT NOT NULL,
    nama_lengkap TEXT NOT NULL, jenis_kelamin TEXT, tempat_lahir TEXT,
    tanggal_lahir TEXT, agama TEXT, status_perkawinan TEXT, pekerjaan TEXT,
    kewarganegaraan TEXT DEFAULT 'WNI', alamat TEXT, rt TEXT, rw TEXT,
    dusun TEXT, status_warga TEXT DEFAULT 'Tetap',
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS kematian (
    id TEXT PRIMARY KEY, warga_id TEXT REFERENCES warga(id) ON DELETE RESTRICT,
    nama_almarhum TEXT NOT NULL, nik_almarhum TEXT NOT NULL, rt TEXT, rw TEXT,
    tanggal_meninggal TEXT NOT NULL, tempat_meninggal TEXT,
    nama_pelapor TEXT NOT NULL, hubungan_pelapor TEXT, no_hp_pelapor TEXT,
    catatan TEXT, status TEXT DEFAULT 'Menunggu', created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY);
  CREATE TABLE IF NOT EXISTS aktivitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT, warga_id TEXT, aksi TEXT NOT NULL,
    judul TEXT NOT NULL, nama TEXT NOT NULL, rt TEXT, rw TEXT,
    aktor TEXT NOT NULL, waktu TEXT NOT NULL, snapshot TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_warga_wilayah ON warga(rw, rt);
  CREATE INDEX IF NOT EXISTS idx_kematian_tanggal ON kematian(tanggal_meninggal);
  CREATE INDEX IF NOT EXISTS idx_kematian_warga ON kematian(warga_id);
  CREATE INDEX IF NOT EXISTS idx_aktivitas_warga ON aktivitas(warga_id, waktu);
`;
