import { spawn } from 'node:child_process'

const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: '3100' },
  stdio: 'inherit',
})

const stop = (signal) => {
  if (!server.killed) server.kill(signal)
}

process.on('SIGINT', () => stop('SIGINT'))
process.on('SIGTERM', () => stop('SIGTERM'))
server.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
