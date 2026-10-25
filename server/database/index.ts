import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { schemaSql } from './schema'
import { seedDatabase } from './seed'

let sqlite: DatabaseSync | undefined

export function transaction<T>(db: DatabaseSync, work: () => T): T {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = work()
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function initDb() {
  if (sqlite) return sqlite
  const configured = process.env.DATABASE_URL || './data/sunggumanai.db'
  const path = configured === ':memory:' ? configured : resolve(configured)
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;')
  try {
    transaction(db, () => {
      db.exec(schemaSql)
      // Migrasi aditif: jangan reset/menimpa database milik pengguna.
      const columns = db.prepare('PRAGMA table_info(kematian)').all().map(c => c.name)
      for (const [name, type] of Object.entries({ updated_at: 'TEXT', surat_nama: 'TEXT', surat_tipe: 'TEXT', surat_data: 'BLOB' })) {
        if (!columns.includes(name)) db.exec(`ALTER TABLE kematian ADD COLUMN ${name} ${type}`)
      }
      if (!db.prepare('SELECT 1 FROM migrations WHERE name = ?').get('initial-data')) {
        const count = Number(db.prepare('SELECT COUNT(*) AS c FROM warga').get()!.c)
        const deaths = Number(db.prepare('SELECT COUNT(*) AS c FROM kematian').get()!.c)
        if (count === 0 && deaths === 0 && process.env.DATABASE_SEED !== 'false') seedDatabase(db)
        db.prepare('INSERT INTO migrations(name) VALUES (?)').run('initial-data')
      }
      if (!db.prepare('SELECT 1 FROM migrations WHERE name = ?').get('activity-baseline')) {
        const log = db.prepare(`INSERT INTO aktivitas
          (warga_id, aksi, judul, nama, rt, rw, aktor, waktu, snapshot) VALUES (?,?,?,?,?,?,?,?,?)`)
        for (const w of db.prepare('SELECT * FROM warga').all()) {
          log.run(w.id!, 'create', 'Data warga ditambahkan', w.nama_lengkap!, w.rt ?? '', w.rw ?? '', 'Admin Desa', w.created_at!, JSON.stringify(w))
          if (w.updated_at !== w.created_at) {
            log.run(w.id!, 'update', 'Data warga diperbarui', w.nama_lengkap!, w.rt ?? '', w.rw ?? '', 'Admin Desa', w.updated_at!, JSON.stringify(w))
          }
        }
        db.prepare('INSERT INTO migrations(name) VALUES (?)').run('activity-baseline')
      }
    })
    sqlite = db
    return db
  } catch (error) {
    db.close()
    throw error
  }
}

export const getSqlite = () => sqlite ?? initDb()

export function closeDb() {
  sqlite?.close()
  sqlite = undefined
}
