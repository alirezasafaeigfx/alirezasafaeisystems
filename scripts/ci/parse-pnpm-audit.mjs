import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const severities = ['info', 'low', 'moderate', 'high', 'critical']
const severitySet = new Set(severities)
const blockingSeverities = new Set(['high', 'critical'])

/**
 * Normalize metadata severity totals while rejecting incomplete or malformed
 * provider payloads. Unknown severity keys are accumulated into `unknown` so
 * the caller can fail closed without discarding provider-reported findings.
 */
function summarizeMetadataCounts(metadataCounts) {
  if (!metadataCounts || typeof metadataCounts !== 'object' || Array.isArray(metadataCounts)) {
    throw new Error('unsupported pnpm audit payload')
  }

  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 }
  for (const severity of severities) {
    const count = metadataCounts[severity]
    if (!Number.isInteger(count) || count < 0) throw new Error('unsupported pnpm audit payload')
    counts[severity] = count
  }

  for (const [severity, count] of Object.entries(metadataCounts)) {
    if (severitySet.has(severity)) continue
    if (!Number.isInteger(count) || count < 0) throw new Error('unsupported pnpm audit payload')
    counts.unknown += count
  }

  return counts
}

/**
 * Count provider finding records by severity, routing unrecognized severities
 * to `unknown` so an unfamiliar provider value remains fail-closed.
 */
function summarizeFindingCounts(findings) {
  if (!findings || typeof findings !== 'object' || Array.isArray(findings)) {
    throw new Error('unsupported pnpm audit payload')
  }

  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, unknown: 0 }
  for (const finding of Object.values(findings)) {
    const severity = String(finding?.severity ?? '').toLowerCase()
    if (severitySet.has(severity)) counts[severity] += 1
    else counts.unknown += 1
  }
  return counts
}

/**
 * Summarize supported pnpm/npm audit payloads into severity totals.
 */
export function summarizeAuditReport(report) {
  if (!report || typeof report !== 'object') throw new Error('unsupported pnpm audit payload')

  const metadataCounts = report.metadata?.vulnerabilities ?? report.metadata?.advisories
  const findings = report.vulnerabilities ?? report.advisories
  if (metadataCounts !== undefined) {
    const counts = summarizeMetadataCounts(metadataCounts)
    if (findings !== undefined) {
      const findingCounts = summarizeFindingCounts(findings)
      for (const severity of [...severities, 'unknown']) {
        counts[severity] = Math.max(counts[severity], findingCounts[severity])
      }
    }
    return counts
  }

  return summarizeFindingCounts(findings)
}

/**
 * Extract the first useful advisory description from an npm-style `via` list.
 */
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

/**
 * Return concise high/critical/unknown advisory descriptions without dumping raw audit
 * payloads into CI logs.
 */
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
    const isUnknownSeverity = !severitySet.has(severity)
    if (!blockingSeverities.has(severity) && !isUnknownSeverity) continue
    const packageName = String(finding?.module_name ?? finding?.name ?? key).trim() || key
    const displaySeverity = isUnknownSeverity ? 'unknown' : severity
    const fallback = viaDetail(finding?.via)
    const title = String(finding?.title ?? fallback?.title ?? '').trim()
    const url = String(finding?.url ?? fallback?.url ?? '').trim()
    const line = [
      `${displaySeverity} ${packageName}`,
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
