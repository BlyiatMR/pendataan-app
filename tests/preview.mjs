// Preview QA terisolasi; tidak pernah membuka database atau .env pengguna.
import { mkdtemp, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { startServer, credentials, root } from './helpers.mjs'

const parent = join(root, '.data')
await mkdir(parent, { recursive: true })
const directory = await mkdtemp(join(parent, 'qa-'))
const server = await startServer(join(directory, 'qa.db'), { seed: true, port: 3001 })
console.log(`QA preview: ${server.base}`)
console.log(`Akun uji: ${credentials.username} / ${credentials.password}`)
async function stop() {
  await server.stop()
  await rm(directory, { recursive: true, force: true })
  process.exit()
}
process.once('SIGINT', stop)
process.once('SIGTERM', stop)
