// server/plugins/db.ts — Nitro plugin: inisialisasi DB saat server start
import { initDb, closeDb } from '../database/index'

export default defineNitroPlugin((nitro) => {
  initDb()
  nitro.hooks.hook('close', closeDb)
})
