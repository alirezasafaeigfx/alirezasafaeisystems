import { cpSync, mkdirSync } from 'node:fs'

const root = process.cwd()
const standalone = `${root}/.next/standalone`

mkdirSync(`${standalone}/.next`, { recursive: true })
cpSync(`${root}/.next/static`, `${standalone}/.next/static`, { recursive: true, force: true })
cpSync(`${root}/public`, `${standalone}/public`, { recursive: true, force: true })
