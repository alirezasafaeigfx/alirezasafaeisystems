import type { ReactNode } from 'react'

function renderLine(line: string, index: number): ReactNode {
  if (line.startsWith('### ')) return <h4 key={index}>{line.slice(4)}</h4>
  if (line.startsWith('## ')) return <h3 key={index}>{line.slice(3)}</h3>
  if (line.startsWith('# ')) return <h2 key={index}>{line.slice(2)}</h2>
  if (line.startsWith('- ')) return <li key={index}>{line.slice(2)}</li>
  return line.trim() ? <p key={index}>{line}</p> : null
}

export function BlogMarkdown({ content, locale }: { content: string; locale: 'fa' | 'en' }) {
  const blocks = content.split(/```/)
  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className="prose prose-neutral max-w-none dark:prose-invert">
      {blocks.map((block, index) => index % 2 === 1
        ? <pre key={index} dir="ltr"><code>{block.replace(/^\w+\n/, '')}</code></pre>
        : block.split('\n').map(renderLine))}
    </div>
  )
}
