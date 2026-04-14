interface Props {
  label: string
  service: string
  dotColor: string
  pulse?: boolean
}

export function StatusRow({ label, service, dotColor, pulse = false }: Props) {
  return (
    <div className="flex items-center gap-2 h-8">
      <span
        className={`inline-block rounded-full flex-shrink-0 ${pulse ? 'dot-pulse' : ''}`}
        style={{
          width: '6px',
          height: '6px',
          background: dotColor,
        }}
      />
      <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto' }}>{service}</span>
    </div>
  )
}
