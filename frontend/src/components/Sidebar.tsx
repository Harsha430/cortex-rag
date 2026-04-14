import { Plus, Cpu, Telescope, FileText, Calculator, Scale, List } from 'lucide-react'
import { Mode } from '../types'
import { StatusRow } from './StatusRow'

interface Props {
  mode: Mode
  onModeChange: (m: Mode) => void
  onNewSession: () => void
  onInjectInput: (text: string) => void
}

const quickActions = [
  { label: 'Summarize document', icon: FileText },
  { label: 'Solve math problem', icon: Calculator },
  { label: 'Compare sources', icon: Scale },
  { label: 'Extract key facts', icon: List },
]

interface ModeButtonProps {
  id: Mode
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  label: string
  sublabel: string
  active: boolean
  onClick: () => void
}

function ModeButton({ id: _id, icon: Icon, label, sublabel, active, onClick }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left transition-colors"
      style={{
        height: '44px',
        padding: '0 12px',
        borderRadius: active ? '0 8px 8px 0' : '8px',
        background: active ? 'var(--violet-dim)' : 'transparent',
        border: active ? '1px solid rgba(124,106,247,0.35)' : '1px solid transparent',
        borderLeft: active ? '2px solid var(--violet)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background 150ms, border-color 150ms',
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = 'var(--bg-elevated)'
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      <Icon
        size={16}
        style={{ color: active ? 'var(--violet)' : 'var(--muted)', flexShrink: 0, transition: 'color 150ms' }}
      />
      <div className="flex flex-col min-w-0">
        <span style={{
          fontSize: '13px',
          fontWeight: 500,
          color: active ? 'var(--primary)' : 'var(--secondary)',
          lineHeight: 1.3,
          transition: 'color 150ms',
        }}>
          {label}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>
          {sublabel}
        </span>
      </div>
    </button>
  )
}

export function Sidebar({ mode, onModeChange, onNewSession, onInjectInput }: Props) {
  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        width: '260px',
        height: '100%',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 16px 16px' }}>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{
              width: '24px',
              height: '24px',
              background: 'var(--violet-dim)',
              border: '1px solid rgba(124,106,247,0.3)',
            }}
          >
            <Cpu size={13} style={{ color: 'var(--violet)' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--primary)' }}>CortexRAG</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '32px' }}>
          Hybrid reasoning engine
        </p>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '0 16px' }} />

      <div style={{ padding: '16px 16px 0' }}>
        <button
          onClick={onNewSession}
          className="flex items-center gap-2 w-full transition-colors"
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--secondary)',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-hover)'
            e.currentTarget.style.color = 'var(--primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--secondary)'
          }}
        >
          <Plus size={16} style={{ flexShrink: 0 }} />
          New session
        </button>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <p
          className="uppercase tracking-widest mb-2"
          style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.1em' }}
        >
          Intelligence Mode
        </p>
        <div className="flex flex-col gap-1">
          <ModeButton
            id="general"
            icon={Cpu}
            label="General Reasoning"
            sublabel="Tool-augmented chat"
            active={mode === 'general'}
            onClick={() => onModeChange('general')}
          />
          <ModeButton
            id="research"
            icon={Telescope}
            label="Research Mode"
            sublabel="Deep document RAG"
            active={mode === 'research'}
            onClick={() => onModeChange('research')}
          />
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <p
          className="uppercase tracking-widest mb-2"
          style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.1em' }}
        >
          Quick Actions
        </p>
        <div className="flex flex-col gap-1">
          {quickActions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => onInjectInput(label)}
              className="flex items-center gap-3 w-full text-left transition-colors"
              style={{
                height: '36px',
                padding: '0 12px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--secondary)',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.color = 'var(--primary)'
                const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                if (icon) icon.style.color = 'var(--violet)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--secondary)'
                const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                if (icon) icon.style.color = 'var(--muted)'
              }}
            >
              <Icon
                size={14}
                className="action-icon flex-shrink-0"
                style={{ color: 'var(--muted)', transition: 'color 150ms' }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto" style={{ padding: '20px 16px 0' }}>
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />
        <p
          className="uppercase tracking-widest mb-2"
          style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.1em' }}
        >
          Services
        </p>
        <StatusRow label="Vector Store" service="Pinecone" dotColor="var(--cyan)" />
        <StatusRow label="Language Model" service="Groq LLM" dotColor="var(--violet)" pulse />
        <StatusRow label="Web Search" service="Tavily" dotColor="var(--emerald)" />
        <p style={{ fontSize: '10px', color: 'var(--muted)', padding: '12px 0 20px' }}>v1.0.0</p>
      </div>
    </div>
  )
}
