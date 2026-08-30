type OperationalSceneProps = {
  isFa: boolean
}

export function OperationalScene({ isFa }: OperationalSceneProps) {
  const copy = isFa
    ? {
        label: 'صحنه عملیاتی مسیر تحویل',
        title: 'از مسئله تا شواهد قابل بررسی',
        nodes: ['مسئله', 'معماری', 'انتشار', 'شواهد'],
        state: 'مسیر پایدار و قابل راستی‌آزمایی',
      }
    : {
        label: 'Operational delivery path',
        title: 'From problem to reviewable evidence',
        nodes: ['Problem', 'Architecture', 'Release', 'Evidence'],
        state: 'Stable path ready for verification',
      }

  return (
    <figure className="operational-scene mt-8 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4 sm:p-5" aria-labelledby="operational-scene-title" data-testid="operational-scene">
      <figcaption>
        <p className="public-kicker">{copy.label}</p>
        <h2 id="operational-scene-title" className="mt-2 text-lg font-black sm:text-xl">{copy.title}</h2>
      </figcaption>
      <svg className="mt-5 h-auto w-full overflow-visible" viewBox="0 0 640 112" role="img" aria-labelledby="operational-scene-title operational-scene-description">
        <desc id="operational-scene-description">{copy.nodes.join(' → ')}</desc>
        <path className="operational-scene__path" d="M48 56 H592" pathLength="1" />
        {copy.nodes.map((node, index) => {
          const x = 48 + index * 181.3
          return (
            <g key={node} className="operational-scene__node">
              <circle cx={x} cy="56" r="18" />
              <text x={x} y="96" textAnchor="middle">{node}</text>
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-xs font-semibold text-muted-foreground">{copy.state}</p>
    </figure>
  )
}
