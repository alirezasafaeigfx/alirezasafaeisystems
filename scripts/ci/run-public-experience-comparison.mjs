import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const SHA = /^[0-9a-f]{40}$/i
const root = process.cwd()
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
await exec('git', ['merge-base', '--is-ancestor', baseSha, candidateSha], { cwd: root })

const worktree = await mkdtemp(resolve(tmpdir(), 'asdev-public-baseline-'))
const processes = []
const run = async (command, args, cwd) => {
  await exec(command, args, { cwd, env: { ...process.env } })
}
const start = (cwd, port) => {
  const child = spawn('pnpm', ['start'], { cwd, env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' }, stdio: 'inherit' })
  processes.push(child)
  return child
}
const waitFor = async (url) => {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500))
  }
  throw new Error(`server did not become ready: ${url}`)
}
try {
  await exec('git', ['worktree', 'add', '--detach', worktree, baseSha], { cwd: root })
  await run('pnpm', ['install', '--frozen-lockfile'], worktree)
  await run('pnpm', ['build'], worktree)
  await run('pnpm', ['build'], root)
  start(worktree, 3101)
  start(root, 3102)
  await waitFor('http://127.0.0.1:3101/')
  await waitFor('http://127.0.0.1:3102/')
  await run(process.execPath, [resolve(root, 'scripts/ci/measure-public-experience-budget.mjs'), '--baseline-url', 'http://127.0.0.1:3101/', '--candidate-url', 'http://127.0.0.1:3102/', '--baseline-sha', baseSha, '--candidate-sha', candidateSha, '--output', resolve(root, output)], root)
} finally {
  for (const child of processes) child.kill('SIGTERM')
  await exec('git', ['worktree', 'remove', '--force', worktree], { cwd: root }).catch(() => {})
  await rm(worktree, { recursive: true, force: true }).catch(() => {})
}
