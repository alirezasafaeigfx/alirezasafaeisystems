import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const severities = ['info', 'low', 'moderate', 'high', 'critical']

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

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const filePath = process.argv[2]
  if (!filePath) throw new Error('usage: node parse-pnpm-audit.mjs <audit-json>')
  const report = JSON.parse(readFileSync(filePath, 'utf8'))
  const counts = summarizeAuditReport(report)
  process.stdout.write(`pnpm audit summary => critical=${counts.critical} high=${counts.high} moderate=${counts.moderate} low=${counts.low} info=${counts.info} unknown=${counts.unknown}\n`)
  if (counts.critical > 0 || counts.high > 0 || counts.unknown > 0) {
    process.stderr.write('Blocking due to high/critical vulnerabilities or an unknown audit schema.\n')
    process.exitCode = 1
  }
}