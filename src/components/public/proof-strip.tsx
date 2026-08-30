import { CheckCircle2 } from 'lucide-react'
import { isPublishableEvidence, type EvidenceRecord } from '@/lib/evidence'

export type ProofItem = {
  title: string
  description: string
  evidence: EvidenceRecord
}

type ProofStripProps = {
  ariaLabel: string
  eyebrow: string
  title: string
  description: string
  items: ProofItem[]
}

export function ProofStrip({ ariaLabel, eyebrow, title, description, items }: ProofStripProps) {
  return (
    <section aria-label={ariaLabel} className="public-surface overflow-hidden rounded-[2rem]">
      <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:p-8 lg:p-10">
        <div>
          <p className="public-kicker">{eyebrow}</p>
          <h2 className="public-display mt-3 text-3xl font-black md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-base leading-8 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.filter((item) => isPublishableEvidence(item.evidence)).map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/70 bg-background/72 p-5">
              <CheckCircle2 aria-hidden="true" className="size-5 text-primary" />
              <p className="mt-5 text-lg font-black">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              <details className="mt-4 text-xs leading-6 text-muted-foreground">
                <summary className="cursor-pointer font-semibold text-foreground">Evidence provenance</summary>
                <dl className="mt-2 space-y-1">
                  <div><dt className="inline font-semibold">Source: </dt><dd className="inline">{item.evidence.source}</dd></div>
                  <div><dt className="inline font-semibold">Period: </dt><dd className="inline">{item.evidence.period}</dd></div>
                  <div><dt className="inline font-semibold">Method: </dt><dd className="inline">{item.evidence.method}</dd></div>
                  <div><dt className="inline font-semibold">Verified: </dt><dd className="inline">{item.evidence.verificationDate}</dd></div>
                </dl>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
