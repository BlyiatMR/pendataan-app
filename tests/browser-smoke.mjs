// Browser QA tanpa dependency tambahan. Jalankan dengan BROWSER_PATH Chromium/Chrome/Edge.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { startServer, credentials, root } from './helpers.mjs'

assert.ok(process.env.BROWSER_PATH, 'Isi BROWSER_PATH dengan executable Chromium/Chrome/Edge.')
const parent = join(root, '.data')
await mkdir(parent, { recursive: true })
const temp = await mkdtemp(join(parent, 'browser-test-'))
const screenshots = join(parent, 'qa-screenshots')
await mkdir(screenshots, { recursive: true })
const server = await startServer(join(temp, 'browser.db'), { seed: true })
const browser = spawn(process.env.BROWSER_PATH, [
  '--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${join(temp, 'profile')}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] })
let stderr = ''
browser.stderr.on('data', chunk => { stderr += chunk })
let ws
try {
  for (let i = 0; i < 100 && !stderr.includes('DevTools listening on'); i++) await delay(100)
  const address = /DevTools listening on (ws:\/\/\S+)/.exec(stderr)?.[1]
  assert.ok(address, `Browser debugging tidak tersedia: ${stderr}`)
  const url = new URL(address)
  const targets = await (await fetch(`http://${url.host}/json/list`)).json()
  ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
  let id = 0
  const pending = new Map()
  const errors = []
  let acceptDialog = false
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const key = ++id
      pending.set(key, { resolve, reject })
      ws.send(JSON.stringify({ id: key, method, params }))
    })
  }
  ws.onmessage = ({ data }) => {
    const event = JSON.parse(data)
    if (event.id && pending.has(event.id)) {
      const task = pending.get(event.id)
      pending.delete(event.id)
      if (event.error) task.reject(new Error(JSON.stringify(event.error)))
      else task.resolve(event.result)
    }
    if (event.method === 'Runtime.exceptionThrown') errors.push(event.params.exceptionDetails.text)
    if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') errors.push(event.params.args.map(a => a.value || a.description).join(' '))
    if (event.method === 'Page.javascriptDialogOpening') void send('Page.handleJavaScriptDialog', { accept: acceptDialog })
  }
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  })
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
    return result.result.value
  }
  async function wait(expression) {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return
      await delay(100)
    }
    throw new Error(`UI timeout: ${expression}`)
  }
  const literal = value => JSON.stringify(value)
  async function click(text) {
    await evaluate(`(() => { const el = [...document.querySelectorAll('a,button')].find(el => el.textContent.trim() === ${literal(text)} || el.getAttribute('aria-label') === ${literal(text)}); if (!el) throw Error('Tombol tidak ditemukan: ' + ${literal(text)}); el.click() })()`)
    await delay(250)
  }
  async function fill(label, value) {
    await evaluate(`(() => {
      const label = [...document.querySelectorAll('label')].find(el => el.textContent.trim().replace(/\\s*\\*$/, '') === ${literal(label)});
      const el = label ? document.getElementById(label.htmlFor) : document.querySelector('[placeholder=' + ${literal(JSON.stringify(label))} + '], [aria-label=' + ${literal(JSON.stringify(label))} + ']');
      if (!el) throw Error('Field tidak ditemukan: ' + ${literal(label)});
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${literal(value)});
      el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    })()`)
  }
  async function shot(name) {
    await delay(300)
    const result = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(join(screenshots, `${name}.png`), Buffer.from(result.data, 'base64'))
  }

  await send('Page.navigate', { url: `${server.base}/login` })
  await wait("!!document.getElementById('username')")
  await fill('Username', credentials.username)
  await fill('Password', credentials.password)
  await click('Masuk')
  await wait("location.pathname === '/dashboard' && document.body.innerText.includes('Total Warga')")
  assert.deepEqual(await evaluate('[innerWidth, innerHeight]'), [1440, 900])

  // Dark theme: toggle, persist after reload, and keep the WITA clock at HH:MM.
  await click('Aktifkan tema gelap')
  await wait("document.documentElement.classList.contains('dark')")
  assert.equal(await evaluate("localStorage.getItem('sunggumanai-theme')"), 'dark')
  assert.match(await evaluate("document.querySelector('[aria-label=\"Waktu Indonesia Tengah\"]')?.textContent || ''"), /\d{2}:\d{2} WITA/)
  assert.doesNotMatch(await evaluate("document.querySelector('[aria-label=\"Waktu Indonesia Tengah\"]')?.textContent || ''"), /\d{2}:\d{2}:\d{2} WITA/)
  await wait("document.querySelector('#theme-transition-overlay')?.style.display === 'none'")
  await send('Page.reload')
  await wait("document.documentElement.classList.contains('dark') && location.pathname === '/dashboard'")
  await wait("[...document.querySelectorAll('button')].some(button => button.getAttribute('aria-label') === 'Aktifkan tema terang')")
  await click('Aktifkan tema terang')
  await wait("!document.documentElement.classList.contains('dark')")
  await wait("document.querySelector('#theme-transition-overlay')?.style.display === 'none'")
  await shot('dashboard')
  await click('+ Tambah Warga')
  await wait("!!document.querySelector('form')")
  await click('Simpan Data')
  await wait("!!document.querySelector('[role=alert]')")
  const fields = {
    NIK: '9900000000000088', 'No. Kartu Keluarga': '9900000000000088', 'Nama Lengkap': 'Warga Browser Uji',
    'Jenis Kelamin': 'P', 'Tempat Lahir': 'Gowa', 'Tanggal Lahir': '12 / 05 / 1988', Agama: 'Islam',
    'Status Perkawinan': 'Kawin', Pekerjaan: 'Guru', 'Alamat Lengkap': 'Alamat fiktif browser',
    RT: '01', RW: '02', Dusun: 'Bontoa', 'Status Warga': 'Pendatang',
  }
  for (const [key, value] of Object.entries(fields)) await fill(key, value)
  await shot('form-warga')
  await click('Simpan Data')
  await wait("location.pathname === '/data-warga' && document.body.innerText.includes('Warga Browser Uji')")
  await click('Halaman 2')
  await wait("document.body.innerText.includes('Menampilkan 7–7 dari 7 warga')")
  await click('Halaman 1')
  await wait("document.body.innerText.includes('Warga Browser Uji')")
  await fill('Semua Status', 'Pendatang')
  await click('Cari')
  await wait("document.body.innerText.includes('dari 2 warga')")
  await fill('Semua Status', '')
  await fill('Cari NIK atau nama warga...', 'Warga Browser Uji')
  await click('Cari')
  await wait("document.body.innerText.includes('dari 1 warga')")
  await click('Lihat detail')
  await wait("document.body.innerText.includes('Detail Warga') && document.body.innerText.includes('Warga Browser Uji')")
  const detailPath = await evaluate('location.pathname')
  assert.ok(await evaluate("document.body.innerText.includes('Warga Pendatang')"))
  await send('Page.reload')
  await wait("document.body.innerText.includes('Warga Browser Uji')")
  await click('Ubah Data')
  await wait("!!document.querySelector('form')")
  await fill('Nama Lengkap', 'Warga Browser Diubah')
  await click('Simpan Data')
  await wait("location.pathname === '/data-warga' && document.body.innerText.includes('Warga Browser Diubah')")
  await send('Page.navigate', { url: server.base + detailPath })
  await wait("document.body.innerText.includes('Warga Browser Diubah')")
  await shot('detail-warga')
  await click('Lapor Kematian')
  await wait("!!document.querySelector('form') && document.body.innerText.includes('Warga Browser Diubah')")
  await click('Batal')
  await wait("location.pathname === '/catatan-kematian' && document.body.innerText.includes('Hj. Marhani')")
  await click('+ Lapor Kematian')
  await wait("!!document.querySelector('form')")
  assert.equal(await evaluate("document.body.innerText.includes('Dipilih')"), false)
  await fill('Cari Warga', 'Warga Browser Diubah')
  await wait("[...document.querySelectorAll('button')].some(b => b.textContent.includes('Warga Browser Diubah'))")
  await click('Warga Browser Diubah • 9900000000000088')
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date())
  await fill('Tanggal Meninggal', today.split('-').reverse().join(' / '))
  await fill('Nama Pelapor', 'Pelapor Browser')
  await fill('Catatan', 'Catatan browser')
  const uploadPath = join(temp, 'surat-browser.pdf')
  await writeFile(uploadPath, '%PDF-1.4\n% synthetic browser attachment\n%%EOF')
  const document = await send('DOM.getDocument')
  const fileInput = await send('DOM.querySelector', { nodeId: document.root.nodeId, selector: 'input[type=file]' })
  await send('DOM.setFileInputFiles', { nodeId: fileInput.nodeId, files: [uploadPath] })
  await wait("document.body.innerText.includes('surat-browser.pdf')")
  await shot('form-kematian')
  await click('Simpan Laporan')
  await wait("location.pathname === '/catatan-kematian' && document.body.innerText.includes('Pelapor Browser')")
  await click('Lihat detail Warga Browser Diubah')
  await wait("!!document.querySelector('form')")
  assert.ok(await evaluate("document.body.innerText.includes('surat-browser.pdf') && document.body.innerText.includes('Unduh surat kematian')"))
  await fill('Nama Pelapor', 'Pelapor Diubah')
  await click('Simpan Laporan')
  await wait("location.pathname === '/catatan-kematian' && document.body.innerText.includes('Pelapor Diubah')")
  await click('Laporan')
  await wait("document.body.innerText.includes('Laporan Bulanan') && document.body.innerText.includes('Total')")
  await shot('laporan')
  await fill('Pilih periode', '2026-08')
  await wait("document.body.innerText.includes('Per akhir Agustus 2026')")
  await click('Catatan Kematian')
  await wait("document.body.innerText.includes('Pelapor Diubah')")
  await click('Lihat detail Warga Browser Diubah')
  await wait("!!document.querySelector('form')")
  await click('Hapus Laporan')
  assert.ok((await evaluate('location.search')).includes('laporan='))
  acceptDialog = true
  await click('Hapus Laporan')
  await wait("location.pathname === '/catatan-kematian' && !document.body.innerText.includes('Pelapor Diubah')")
  await send('Page.navigate', { url: server.base + detailPath })
  await wait("document.body.innerText.includes('Warga Browser Diubah')")
  await click('Hapus Data')
  await wait("location.pathname === '/data-warga' && !document.body.innerText.includes('Warga Browser Diubah')")
  await click('Keluar')
  await wait("location.pathname === '/login'")
  assert.deepEqual(errors, [], `Kesalahan browser: ${errors.join('\n')}`)
  console.log('Browser passed: login, theme toggle/persistence, WITA clock HH:MM, validation, create/read/reload/update/delete warga, resident search/preselect, create/update/delete kematian, reports, cancel/confirm deletion, logout; 1440x900; no console errors.')
  console.log('Screenshots: .data/qa-screenshots/')
} finally {
  ws?.close()
  if (browser.exitCode === null && browser.signalCode === null) {
    const exited = new Promise(resolve => browser.once('exit', resolve))
    browser.kill()
    await exited
  }
  await server.stop()
  await rm(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 })
}
