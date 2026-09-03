import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const severities = ['info', 'low', 'moderate', 'high', 'critical']
const blockingSeverities = new Set(['high', 'critical'])

export function summarizeAuditReport(report) {
  if (!report || typeof report !== 'object') throw new Error('unsupported pnpm audit payload')
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 }
  const metadataCounts = report.metadata?.vulnerabilities
  if (metadataCounts && typeof metadataCounts === 'object') {
    for (const severity of severities) {
      const count = metadataCounts[severity]
      if (!Number.isInteger(count) || count < 0) throw new Error('unsupported pnpm audit payload')
      counts[severity] = count
    }
    return counts
  }

  const findings = report.vulnerabilities ?? report.advisories
  if (!findings || typeof findings !== 'object' || Array.isArray(findings)) throw new Error('unsupported pnpm audit payload')
  for (const finding of Object.values(findings)) {
    const severity = String(finding?.severity ?? '').toLowerCase()
    if (severity in counts && severity !== 'unknown') counts[severity] += 1
    else counts.unknown += 1
  }
  return counts
}

function viaDetail(via) {
  if (!Array.isArray(via)) return null
  for (const entry of via) {
    if (typeof entry === 'string' && entry.trim()) return { title: entry.trim(), url: null }
    if (entry && typeof entry === 'object') {
      const title = String(entry.title ?? entry.source ?? entry.name ?? '').trim()
      const url = String(entry.url ?? '').trim()
      if (title || url) return { title: title || null, url: url || null }
    }
  }
  return null
}

export function describeBlockingFindings(report) {
  if (!report || typeof report !== 'object') return []
  const findings = report.advisories && typeof report.advisories === 'object' && !Array.isArray(report.advisories)
    ? report.advisories
    : report.vulnerabilities && typeof report.vulnerabilities === 'object' && !Array.isArray(report.vulnerabilities)
      ? report.vulnerabilities
      : null
  if (!findings) return []

  const lines = []
  const seen = new Set()
  for (const [key, finding] of Object.entries(findings)) {
    const severity = String(finding?.severity ?? '').toLowerCase()
    if (!blockingSeverities.has(severity)) continue
    const packageName = String(finding?.module_name ?? finding?.name ?? key).trim() || key
    const fallback = viaDetail(finding?.via)
    const title = String(finding?.title ?? fallback?.title ?? '').trim()
    const url = String(finding?.url ?? fallback?.url ?? '').trim()
    const line = [
      `${severity} ${packageName}`,
      title || null,
      url || null,
    ].filter(Boolean).join(' — ')
    if (!seen.has(line)) {
      seen.add(line)
      lines.push(line)
    }
  }
  return lines.sort((a, b) => a.localeCompare(b))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const filePath = process.argv[2]
  if (!filePath) throw new Error('usage: node parse-pnpm-audit.mjs <audit-json>')
  const report = JSON.parse(readFileSync(filePath, 'utf8'))
  const counts = summarizeAuditReport(report)
  process.stdout.write(`pnpm audit summary => critical=${counts.critical} high=${counts.high} moderate=${counts.moderate} low=${counts.low} info=${counts.info} unknown=${counts.unknown}\n`)
  if (counts.critical > 0 || counts.high > 0 || counts.unknown > 0) {
    const findings = describeBlockingFindings(report)
    if (findings.length) {
      for (const finding of findings) process.stdout.write(`blocking advisory => ${finding}\n`)
    } else {
      process.stdout.write('blocking advisory details unavailable in provider payload\n')
    }
    process.stderr.write('Blocking due to high/critical vulnerabilities or an unknown audit schema.\n')
    process.exitCode = 1
  }
}