import type { DatabaseSync } from 'node:sqlite'
import { detailAndiBaso, detailLainnya } from '../../app/data/warga'
import { catatanKematian } from '../../app/data/kematian'

// Hanya dipanggil sekali untuk database kosong. Mock asli tidak diubah.
export function seedDatabase(db: DatabaseSync) {
  const insert = db.prepare(`INSERT INTO warga
    (id, nik, no_kk, nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir,
     agama, status_perkawinan, pekerjaan, kewarganegaraan, alamat, rt, rw,
     dusun, status_warga, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
  for (const w of [detailAndiBaso, ...Object.values(detailLainnya)]) {
    const created = w.riwayat[w.riwayat.length - 1]!.tanggal
    insert.run(w.id, w.nik, w.noKk, w.nama, w.jk, w.tempatLahir, w.tanggalLahir,
      w.agama, w.statusPerkawinan, w.pekerjaan, w.kewarganegaraan, w.alamat,
      w.rt, w.rw, w.dusun, w.status, `${created}T00:00:00.000Z`, `${w.diperbarui}T00:00:00.000Z`)
  }
  const death = db.prepare(`INSERT INTO kematian
    (id, nama_almarhum, nik_almarhum, rt, rw, tanggal_meninggal, nama_pelapor, status, created_at)
    VALUES (?,?,?,?,?,?,?,?,?)`)
  for (const k of catatanKematian) {
    death.run(k.id, k.nama, k.nik, k.rt, k.rw, k.tgl, k.pelapor, k.status, `${k.tgl}T00:00:00.000Z`)
  }
}
