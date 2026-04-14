export function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: '28px',
          height: '28px',
          background: 'rgba(124,106,247,0.2)',
          alignSelf: 'flex-start',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--violet)' }}>C</span>
      </div>
      <div
        className="rounded-[2px_14px_14px_14px] px-4 py-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-[6px] mb-2">
          {[0, 150, 300].map((delay, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                background: 'var(--violet)',
                animation: `bounce 0.8s ease-in-out ${delay}ms infinite alternate`,
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>Reasoning...</p>
      </div>
    </div>
  )
}
