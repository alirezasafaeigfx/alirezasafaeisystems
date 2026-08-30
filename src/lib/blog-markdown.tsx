import type { ReactNode } from 'react'

function renderInline(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  const parts: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index))
    parts.push(
      <a
        key={`${match.index}-${match[2]}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
      >
        {match[1]}
      </a>,
    )
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts.length > 0 ? parts : text
}

function renderTextBlock(block: string, blockIndex: number): ReactNode[] {
  const lines = block.split('\n')
  const nodes: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      nodes.push(<h4 key={`${blockIndex}-${index}`}>{renderInline(line.slice(4))}</h4>)
      index += 1
      continue
    }
    if (line.startsWith('## ')) {
      nodes.push(<h3 key={`${blockIndex}-${index}`}>{renderInline(line.slice(3))}</h3>)
      index += 1
      continue
    }
    if (line.startsWith('# ')) {
      nodes.push(<h2 key={`${blockIndex}-${index}`}>{renderInline(line.slice(2))}</h2>)
      index += 1
      continue
    }
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (index < lines.length && (lines[index] ?? '').startsWith('> ')) {
        quoteLines.push((lines[index] ?? '').slice(2))
        index += 1
      }
      nodes.push(
        <blockquote key={`${blockIndex}-quote-${index}`}>
          {renderInline(quoteLines.join(' '))}
        </blockquote>,
      )
      continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (index < lines.length && (lines[index] ?? '').startsWith('- ')) {
        items.push((lines[index] ?? '').slice(2))
        index += 1
      }
      nodes.push(
        <ul key={`${blockIndex}-list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${blockIndex}-${index}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    nodes.push(<p key={`${blockIndex}-${index}`}>{renderInline(line)}</p>)
    index += 1
  }

  return nodes
}

export function BlogMarkdown({ content, locale }: { content: string; locale: 'fa' | 'en' }) {
  const blocks = content.split(/```/)

  return (
    <div
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className="article-prose mx-auto max-w-[72ch] text-[1.02rem] leading-8 text-foreground/90 [&_a]:break-words [&_blockquote]:my-7 [&_blockquote]:border-s-2 [&_blockquote]:border-primary/45 [&_blockquote]:ps-5 [&_blockquote]:text-muted-foreground [&_code]:font-mono [&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:mb-3 [&_h4]:mt-8 [&_h4]:text-xl [&_h4]:font-semibold [&_li]:my-2 [&_p]:my-5 [&_pre]:my-7 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border/70 [&_pre]:bg-muted/45 [&_pre]:p-5 [&_pre]:text-sm [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:ps-6"
    >
      {blocks.map((block, index) =>
        index % 2 === 1 ? (
          <pre key={`code-${index}`} dir="ltr">
            <code>{block.replace(/^\w+\n/, '').trim()}</code>
          </pre>
        ) : (
          renderTextBlock(block, index)
        ),
      )}
    </div>
  )
}
