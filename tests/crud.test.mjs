import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createRequire } from 'node:module'
import { startServer, credentials } from './helpers.mjs'

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date())
const period = today.slice(0, 7)
const resident = (i = 1) => ({
  nik: `990000000000${String(i).padStart(4, '0')}`, noKk: '9900000000009999', namaLengkap: `Warga Uji ${i}`,
  jenisKelamin: 'L', tempatLahir: 'Gowa', tanggalLahir: '12 / 05 / 1988', agama: 'Islam',
  statusPerkawinan: 'Kawin', pekerjaan: 'Petani', kewarganegaraan: 'WNI', alamat: 'Alamat fiktif pengujian',
  rt: '1', rw: '2', dusun: 'Bontoa', statusWarga: 'Tetap',
})

test('SQLite CRUD terintegrasi melalui server produksi', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'sunggumanai-test-'))
  const database = join(dir, 'test.db')
  let server = await startServer(database)
  t.after(async () => { await server.stop(); await rm(dir, { recursive: true, force: true }) })
  let cookie = ''
  async function request(path, { method = 'GET', body, status = 200, authenticated = true, headers = {} } = {}) {
    const response = await fetch(`${server.base}${path}`, {
      method, headers: { ...(authenticated && cookie ? { cookie } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    assert.equal(response.status, status, `${method} ${path}: ${await response.clone().text()}`)
    return response
  }
  const json = async (...args) => (await request(...args)).json()
  async function login() {
    const response = await request('/api/auth/login', { method: 'POST', body: credentials })
    cookie = response.headers.get('set-cookie').split(';')[0]
    assert.match(response.headers.get('set-cookie'), /HttpOnly/i)
  }
  let warga
  let laporan

  await t.test('semua endpoint pribadi menolak tanpa sesi', async () => {
    for (const path of ['/api/warga', '/api/warga/1', '/api/kematian', '/api/kematian/1', '/api/kematian/1/surat', '/api/dashboard', '/api/laporan', '/api/laporan/export-pdf', '/api/laporan/export-excel']) {
      await request(path, { status: 401, authenticated: false })
    }
    for (const path of ['/api/warga', '/api/kematian']) {
      await request(path, { method: 'POST', body: {}, status: 401, authenticated: false })
      for (const method of ['PUT', 'DELETE']) await request(`${path}/1`, { method, body: {}, status: 401, authenticated: false })
    }
    await request('/api/auth/login', { method: 'POST', body: { username: 'wrong', password: 'wrong' }, status: 401 })
    await login()
    assert.equal((await json('/api/auth/me')).authenticated, true)
  })
  await t.test('database kosong dan nol statistik tidak diganti angka mock', async () => {
    assert.equal((await json('/api/warga')).total, 0)
    const report = await json('/api/laporan')
    assert.deepEqual(report.stats, { totalWarga: 0, kematian: 0, diperbarui: 0, baru: 0 })
    assert.equal(report.total.kk, 0)
    assert.ok((await json('/api/dashboard')).stats.every(s => s.value === '0'))
  })
  await t.test('validasi tipe, NIK, KK, tanggal, enum, dan asal permintaan', async () => {
    for (const body of [null, [], { ...resident(), nik: 'abcdefghijklmnop' }, { ...resident(), noKk: 123 },
      { ...resident(), namaLengkap: '  ' }, { ...resident(), tanggalLahir: '31 / 02 / 2020' },
      { ...resident(), tanggalLahir: '2999-01-01' }, { ...resident(), jenisKelamin: 'X' }, { ...resident(), rt: 'abc' }]) {
      await request('/api/warga', { method: 'POST', body, status: 422 })
    }
    await request('/api/warga', { method: 'POST', body: resident(), status: 403, headers: { origin: 'https://untrusted.invalid' } })
    await request('/api/warga', { method: 'POST', body: resident(), status: 415, headers: { 'Content-Type': 'text/plain' } })
  })
  await t.test('create, baca lengkap, dan NIK duplikat', async () => {
    warga = await json('/api/warga', { method: 'POST', body: resident(), status: 201 })
    const saved = await json(`/api/warga/${warga.id}`)
    assert.equal(saved.noKk, resident().noKk)
    assert.equal(saved.tanggalLahir, '1988-05-12')
    assert.equal(saved.rt, '01')
    assert.equal(saved.rw, '02')
    assert.equal(saved.alamat, resident().alamat)
    assert.equal(saved.riwayat.length, 1)
    await request('/api/warga', { method: 'POST', body: resident(), status: 409 })
    const check = new DatabaseSync(database, { readOnly: true })
    assert.equal(check.prepare('SELECT COUNT(*) AS c FROM warga').get().c, 1)
    assert.equal(check.prepare('PRAGMA integrity_check').get().integrity_check, 'ok')
    check.close()
  })
  await t.test('update menyimpan semua field, dapat mengosongkan field, dan mencatat riwayat', async () => {
    const saved = await json(`/api/warga/${warga.id}`, { method: 'PUT', body: { namaLengkap: 'Warga Uji Diubah', pekerjaan: '', statusWarga: 'Pendatang' } })
    assert.equal(saved.namaLengkap, 'Warga Uji Diubah')
    assert.equal(saved.pekerjaan, '')
    assert.equal(saved.riwayat.length, 2)
    await request(`/api/warga/${warga.id}`, { method: 'PUT', body: { nik: '' }, status: 422 })
    await request('/api/warga/tidak-ada', { method: 'PUT', body: resident(), status: 404 })
  })

  await t.test('pencarian, filter, dan pagination memakai seluruh database', async () => {
    for (let i = 2; i <= 8; i++) await json('/api/warga', { method: 'POST', body: resident(i), status: 201 })
    const first = await json('/api/warga?page=1')
    const second = await json('/api/warga?page=2')
    assert.equal(first.total, 8)
    assert.equal(first.items.length, 6)
    assert.equal(second.items.length, 2)
    assert.ok(second.items.every(w => !first.items.some(a => a.id === w.id)))
    assert.equal((await json('/api/warga?q=Diubah&rw=rw02&rt=rt01&status=Pendatang')).total, 1)
    assert.equal((await json('/api/warga?q=tidak-ada')).total, 0)
    assert.equal((await json('/api/warga?q=%25')).total, 0)
    assert.equal((await json('/api/warga?page=999')).page, 2)
    for (const page of ['0', '-1', 'x', '1.5']) await request(`/api/warga?page=${page}`, { status: 422 })
    await request('/api/warga?q=a&q=b', { status: 422 })
    await request('/api/warga/tidak-ada', { status: 404 })
    const other = (await json(`/api/warga?q=${resident(2).nik}`)).items[0]
    await request(`/api/warga/${other.id}`, { method: 'PUT', body: { nik: warga.nik }, status: 409 })
  })
  await t.test('create kematian mengambil identitas dari warga, bukan nama kiriman klien', async () => {
    const body = { wargaId: warga.id, tanggalMeninggal: today, namaPelapor: 'Pelapor Uji', namaAlmarhum: 'Nama palsu', nikAlmarhum: 'invalid' }
    await request('/api/kematian', { method: 'POST', body: { ...body, wargaId: 'tidak-ada' }, status: 404 })
    await request('/api/kematian', { method: 'POST', body: { ...body, wargaId: '' }, status: 422 })
    await request('/api/kematian', { method: 'POST', body: { ...body, tanggalMeninggal: '1980-01-01' }, status: 422 })
    laporan = await json('/api/kematian', { method: 'POST', body, status: 201 })
    assert.equal(laporan.namaAlmarhum, 'Warga Uji Diubah')
    assert.equal(laporan.nikAlmarhum, warga.nik)
    assert.equal(laporan.status, 'Menunggu')
    await request('/api/kematian', { method: 'POST', body, status: 409 })
    await request(`/api/warga/${warga.id}`, { method: 'DELETE', status: 409 })
  })
  await t.test('validasi berkas dan transaksi rollback saat unggahan tidak valid', async () => {
    const invalid = { nama: 'surat.pdf', base64: Buffer.from('not a pdf').toString('base64') }
    await request(`/api/kematian/${laporan.id}`, { method: 'PUT', body: { namaPelapor: 'Tidak boleh tersimpan', surat: invalid }, status: 422 })
    assert.equal((await json(`/api/kematian/${laporan.id}`)).namaPelapor, 'Pelapor Uji')
    const oversized = { nama: 'surat.pdf', base64: Buffer.alloc(2 * 1024 * 1024 + 1).toString('base64') }
    await request(`/api/kematian/${laporan.id}`, { method: 'PUT', body: { surat: oversized }, status: 422 })
    const pdf = Buffer.from('%PDF-1.4\n% synthetic test document\n%%EOF')
    await json(`/api/kematian/${laporan.id}`, { method: 'PUT', body: { surat: { nama: 'surat.pdf', base64: pdf.toString('base64') }, status: 'Terverifikasi', catatan: 'Catatan diperbarui' } })
    const download = await request(`/api/kematian/${laporan.id}/surat`)
    assert.equal(download.headers.get('content-type'), 'application/pdf')
    assert.deepEqual(Buffer.from(await download.arrayBuffer()), pdf)
    assert.equal((await json(`/api/kematian/${laporan.id}`)).catatan, 'Catatan diperbarui')
    assert.equal((await json('/api/kematian')).stats.find(s => s.label === 'Menunggu Verifikasi').value, '0')
  })
  await t.test('dashboard, laporan, dan grafik berubah sesudah CRUD', async () => {
    const report = await json(`/api/laporan?periode=${period}`)
    assert.deepEqual(report.stats, { totalWarga: 8, kematian: 1, diperbarui: 1, baru: 8 })
    assert.equal(report.total.kk, 1)
    assert.equal(report.rekap.find(r => r.rw === '02').meninggal, 1)
    const dashboard = await json('/api/dashboard')
    assert.equal(dashboard.stats.find(s => s.label === 'Data Belum Lengkap').value, '1')
    assert.equal(dashboard.grafik.at(-1).value, 1)
    assert.ok(dashboard.aktivitas.some(a => a.judul === 'Laporan kematian diperbarui'))
    const old = await json('/api/laporan?periode=2000-01')
    assert.deepEqual(old.stats, { totalWarga: 0, kematian: 0, diperbarui: 0, baru: 0 })
    for (const invalid of ['abc', '2026-13', '2999-01']) await request(`/api/laporan?periode=${invalid}`, { status: 422 })
  })
  await t.test('PDF dan Excel memuat laporan periode terpilih dari sumber data yang sama', async () => {
    const pdf = await request(`/api/laporan/export-pdf?periode=${period}`)
    assert.equal(pdf.headers.get('content-type'), 'application/pdf')
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString(), '%PDF-')
    const excel = await request(`/api/laporan/export-excel?periode=${period}`)
    const XLSX = createRequire(import.meta.url)('xlsx')
    const workbook = XLSX.read(Buffer.from(await excel.arrayBuffer()), { type: 'buffer' })
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Rekap per RW'], { header: 1 })
    assert.deepEqual(rows.find(row => row[0] === 'RW 02'), ['RW 02', 1, 8, 8, 0, 1])
    await request('/api/laporan/export-excel?periode=invalid', { status: 422 })
  })
  await t.test('data warga, riwayat, laporan, dan surat bertahan setelah restart server', async () => {
    await server.stop()
    server = await startServer(database)
    await login()
    assert.equal((await json('/api/warga')).total, 8)
    assert.equal((await json(`/api/warga/${warga.id}`)).namaLengkap, 'Warga Uji Diubah')
    assert.equal((await json(`/api/warga/${warga.id}`)).riwayat.length, 2)
    assert.equal((await json(`/api/kematian/${laporan.id}`)).suratNama, 'surat.pdf')
    await request(`/api/kematian/${laporan.id}/surat`)
  })
  await t.test('hapus laporan lalu warga memperbarui daftar dan statistik', async () => {
    await json(`/api/kematian/${laporan.id}`, { method: 'DELETE' })
    await request(`/api/kematian/${laporan.id}`, { status: 404 })
    await request(`/api/kematian/${laporan.id}/surat`, { status: 404 })
    await request(`/api/kematian/${laporan.id}`, { method: 'PUT', body: {}, status: 404 })
    await request(`/api/kematian/${laporan.id}`, { method: 'DELETE', status: 404 })
    await json(`/api/warga/${warga.id}`, { method: 'DELETE' })
    await request(`/api/warga/${warga.id}`, { status: 404 })
    await request(`/api/warga/${warga.id}`, { method: 'DELETE', status: 404 })
    const report = await json('/api/laporan')
    assert.equal(report.stats.totalWarga, 7)
    assert.equal(report.stats.kematian, 0)
  })
  await t.test('mengosongkan database tidak memicu seed kembali pada restart', async () => {
    while ((await json('/api/warga')).total) {
      for (const w of (await json('/api/warga')).items) await json(`/api/warga/${w.id}`, { method: 'DELETE' })
    }
    await server.stop()
    server = await startServer(database, { seed: true })
    await login()
    assert.equal((await json('/api/warga')).total, 0)
    await json('/api/auth/logout', { method: 'POST' })
    cookie = ''
    assert.equal((await json('/api/auth/me')).authenticated, false)
    await request('/api/warga', { status: 401 })
  })
})

test('seed sekali dan migrasi database lama tidak menimpa data', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'sunggumanai-migration-'))
  const database = join(dir, 'legacy.db')
  let server = await startServer(database, { seed: true })
  t.after(async () => { await server.stop(); await rm(dir, { recursive: true, force: true }) })
  await server.stop()
  const db = new DatabaseSync(database)
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM warga').get().c, 6)
  assert.equal(db.prepare("SELECT nik FROM warga WHERE id = '2'").get().nik, '7306014509920002')
  assert.equal(db.prepare('SELECT COUNT(*) AS c FROM kematian').get().c, 5)
  // Reproduksi schema sebelumnya hanya pada database tes milik proses ini.
  db.exec("UPDATE warga SET nama_lengkap = 'Nama Lokal Tetap' WHERE id = '1'; DROP TABLE migrations; DROP TABLE aktivitas;")
  for (const name of ['updated_at', 'surat_nama', 'surat_tipe', 'surat_data']) db.exec(`ALTER TABLE kematian DROP COLUMN ${name}`)
  db.close()
  server = await startServer(database, { seed: true })
  await server.stop()
  const check = new DatabaseSync(database)
  assert.equal(check.prepare("SELECT nama_lengkap FROM warga WHERE id = '1'").get().nama_lengkap, 'Nama Lokal Tetap')
  assert.equal(check.prepare('SELECT COUNT(*) AS c FROM warga').get().c, 6)
  assert.ok(check.prepare('PRAGMA table_info(kematian)').all().some(c => c.name === 'surat_data'))
  assert.equal(check.prepare('PRAGMA integrity_check').get().integrity_check, 'ok')
  check.close()
})

test('rekap historis mempertahankan RW bulan sebelumnya setelah pindah dan hapus', async t => {
  const dir = await mkdtemp(join(tmpdir(), 'sunggumanai-history-'))
  const database = join(dir, 'history.db')
  let server = await startServer(database)
  t.after(async () => { await server.stop(); await rm(dir, { recursive: true, force: true }) })
  let cookie
  const login = async () => {
    const response = await fetch(`${server.base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) })
    assert.equal(response.status, 200)
    cookie = response.headers.get('set-cookie').split(';')[0]
  }
  const call = async (path, method = 'GET', body) => {
    const response = await fetch(`${server.base}${path}`, { method, headers: { cookie, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
    assert.ok(response.ok, await response.clone().text())
    return response.json()
  }
  await login()
  const w = await call('/api/warga', 'POST', resident(99))
  await server.stop()
  const previous = new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5)) - 2, 1)).toISOString().slice(0, 7)
  const db = new DatabaseSync(database)
  db.prepare('UPDATE aktivitas SET waktu = ? WHERE warga_id = ?').run(`${previous}-01T00:00:00.000Z`, w.id)
  db.close()
  server = await startServer(database)
  await login()
  await call(`/api/warga/${w.id}`, 'PUT', { rw: '03' })
  const old = await call(`/api/laporan?periode=${previous}`)
  assert.equal(old.rekap.find(r => r.rw === '02').wargaCount, 1)
  assert.equal(old.rekap.find(r => r.rw === '03').wargaCount, 0)
  assert.equal((await call('/api/laporan')).rekap.find(r => r.rw === '03').wargaCount, 1)
  await call(`/api/warga/${w.id}`, 'DELETE')
  assert.equal((await call('/api/laporan')).stats.totalWarga, 0)
  assert.equal((await call(`/api/laporan?periode=${previous}`)).stats.totalWarga, 1)
})
