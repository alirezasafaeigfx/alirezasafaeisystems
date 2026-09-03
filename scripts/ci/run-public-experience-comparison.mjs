import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createServer } from 'node:net'

const exec = promisify(execFile)
const SHA = /^[0-9a-f]{40}$/i
const root = process.cwd()
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const arg = (name) => {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}
const baseSha = arg('--base-sha')
const candidateSha = arg('--candidate-sha')
const output = arg('--output')
if (!SHA.test(baseSha ?? '') || !SHA.test(candidateSha ?? '') || !output) throw new Error('Usage: --base-sha SHA --candidate-sha SHA --output FILE')
const checkedOut = (await exec('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim()
if (checkedOut !== candidateSha) throw new Error(`candidate SHA ${candidateSha} does not match checked-out commit ${checkedOut}`)
const dirty = (await exec('git', ['status', '--porcelain'], { cwd: root })).stdout.trim()
if (dirty) throw new Error('candidate worktree must be clean before performance build')
const baselineSha = (await exec('git', ['merge-base', baseSha, candidateSha], { cwd: root })).stdout.trim()
if (!SHA.test(baselineSha)) throw new Error(`unable to resolve merge-base for ${baseSha} and ${candidateSha}`)

const worktree = await mkdtemp(resolve(tmpdir(), 'asdev-public-baseline-'))
const processes = []
let worktreeAdded = false
const run = async (command, args, cwd) => {
  await exec(command, args, { cwd, env: { ...process.env } })
}
const reservePort = () => new Promise((resolvePort, reject) => {
  const server = createServer()
  server.once('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const address = server.address()
    if (!address || typeof address === 'string') return reject(new Error('unable to reserve comparison port'))
    server.close((error) => error ? reject(error) : resolvePort(address.port))
  })
})
const start = (cwd, port) => {
  const standalone = resolve(cwd, '.next/standalone')
  const child = spawn(process.execPath, ['server.js'], { cwd: standalone, env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' }, stdio: 'inherit', detached: process.platform !== 'win32' })
  child.on('error', (error) => { child.spawnFailure = error })
  processes.push(child)
  return child
}
const waitFor = async (url, child) => {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.spawnFailure) throw new Error('server exited before readiness')
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5_000) })
      if (response.ok) return
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500))
  }
  throw new Error(`server did not become ready: ${url}`)
}
try {
  await exec('git', ['worktree', 'add', '--detach', worktree, baselineSha], { cwd: root })
  worktreeAdded = true
  await run(pnpm, ['install', '--frozen-lockfile'], worktree)
  await run(pnpm, ['build'], worktree)
  await run(pnpm, ['build'], root)
  const baselinePort = await reservePort()
  const candidatePort = await reservePort()
  const baselineServer = start(worktree, baselinePort)
  const candidateServer = start(root, candidatePort)
  const baselineUrl = `http://127.0.0.1:${baselinePort}/`
  const candidateUrl = `http://127.0.0.1:${candidatePort}/`
  await waitFor(baselineUrl, baselineServer)
  await waitFor(candidateUrl, candidateServer)
  await run(process.execPath, [
    resolve(root, 'scripts/ci/measure-public-experience-budget.mjs'),
    '--baseline-url', baselineUrl,
    '--candidate-url', candidateUrl,
    '--baseline-sha', baselineSha,
    '--candidate-sha', candidateSha,
    '--candidate-build-dir', resolve(root, '.next'),
    '--output', resolve(root, output),
  ], root)
} finally {
  for (const child of processes) if (child.exitCode === null) {
    if (process.platform === 'win32') await exec('taskkill', ['/pid', String(child.pid), '/t', '/f']).catch(() => {})
    else child.kill('SIGTERM')
  }
  await Promise.all(processes.map(async (child) => {
    if (child.exitCode !== null) return
    await Promise.race([new Promise((resolvePromise) => child.once('exit', resolvePromise)), new Promise((resolvePromise) => setTimeout(resolvePromise, 5_000))])
    if (child.exitCode === null) {
      if (process.platform === 'win32') await exec('taskkill', ['/pid', String(child.pid), '/t', '/f'])
      else process.kill(-child.pid, 'SIGKILL')
    }
  }))
  if (worktreeAdded) await exec('git', ['worktree', 'remove', '--force', worktree], { cwd: root })
  await rm(worktree, { recursive: true, force: true })
}
