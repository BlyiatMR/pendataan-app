import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

export const root = fileURLToPath(new URL('../', import.meta.url))
export const credentials = { username: 'petugas-test', password: 'test-only-not-for-production' }

export async function startServer(database, { seed = false, port = 0 } = {}) {
  if (!port) {
    const socket = createServer()
    await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve))
    port = socket.address().port
    await new Promise(resolve => socket.close(resolve))
  }
  const child = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port),
      DATABASE_URL: database, DATABASE_SEED: String(seed), ADMIN_USERNAME: credentials.username,
      ADMIN_PASSWORD: credentials.password, JWT_SECRET: randomBytes(32).toString('hex'), SESSION_COOKIE_SECURE: 'false' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let logs = ''
  child.stdout.on('data', chunk => { logs = (logs + chunk).slice(-10000) })
  child.stderr.on('data', chunk => { logs = (logs + chunk).slice(-10000) })
  const base = `http://127.0.0.1:${port}`
  const stop = async () => {
    if (child.exitCode !== null || child.signalCode !== null) return
    const exited = new Promise(resolve => child.once('exit', resolve))
    child.kill()
    await exited
  }
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null || child.signalCode !== null) throw new Error(`Server gagal: ${logs}`)
    try {
      const response = await fetch(`${base}/api/auth/me`)
      if (response.ok) return { base, stop, logs: () => logs }
    } catch {}
    await delay(100)
  }
  await stop()
  throw new Error(`Server tidak siap: ${logs}`)
}
