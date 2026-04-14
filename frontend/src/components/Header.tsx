import { Upload, SlidersHorizontal } from 'lucide-react'
import { Mode } from '../types'

interface Props {
  mode: Mode
  uploadCount: number
  uploadPanelOpen: boolean
  onToggleUpload: () => void
  isMockMode: boolean
}

export function Header({ mode, uploadCount, uploadPanelOpen, onToggleUpload, isMockMode }: Props) {
  const modeLabel = mode === 'general' ? 'General Reasoning' : 'Research Mode'
  const dotColor = mode === 'general' ? 'var(--violet)' : 'var(--cyan)'

  return (
    <div
      className="flex items-center justify-between px-5 flex-shrink-0"
      style={{
        height: '56px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-base)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full flex-shrink-0"
          style={{ width: '8px', height: '8px', background: dotColor, transition: 'background 200ms' }}
        />
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--primary)' }}>
          {modeLabel}
        </span>
        {isMockMode && (
          <span
            className="px-[8px] py-[2px] rounded-[20px] ml-2"
            style={{
              fontSize: '10px',
              background: 'var(--amber-dim)',
              border: '1px solid rgba(245,158,11,0.25)',
              color: 'var(--amber)',
              fontWeight: 500,
            }}
          >
            Mock
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={onToggleUpload}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: '32px',
              height: '32px',
              background: uploadPanelOpen ? 'var(--bg-elevated)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: uploadPanelOpen ? 'var(--violet)' : 'var(--secondary)',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              if (!uploadPanelOpen) e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
            onMouseLeave={e => {
              if (!uploadPanelOpen) e.currentTarget.style.background = 'transparent'
            }}
          >
            <Upload size={15} />
          </button>
          {uploadCount > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full pointer-events-none"
              style={{
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                background: 'var(--violet)',
                fontSize: '10px',
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {uploadCount > 9 ? '9+' : uploadCount}
            </span>
          )}
        </div>

        <button
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--secondary)',
            transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-elevated)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>
    </div>
  )
}
