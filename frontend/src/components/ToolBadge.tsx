import { Globe, Database, Cpu } from 'lucide-react'
import { ToolUsed } from '../types'

interface Props {
  tool: ToolUsed
}

export function ToolBadge({ tool }: Props) {
  if (!tool) return null

  const configs = {
    search_tool: {
      icon: Globe,
      label: 'Web search',
      style: {
        background: 'var(--emerald-dim)',
        border: '1px solid rgba(16,185,129,0.25)',
        color: 'var(--emerald)',
      },
    },
    rag_tool: {
      icon: Database,
      label: 'Knowledge base',
      style: {
        background: 'var(--cyan-dim)',
        border: '1px solid rgba(34,211,238,0.25)',
        color: 'var(--cyan)',
      },
    },
    python_repl_tool: {
      icon: Cpu,
      label: 'Logic engine',
      style: {
        background: 'var(--amber-dim)',
        border: '1px solid rgba(245,158,11,0.25)',
        color: 'var(--amber)',
      },
    },
  }

  const config = configs[tool as keyof typeof configs]
  if (!config) return null
  
  const Icon = config.icon

  return (
    <span
      className="inline-flex items-center gap-1 px-[10px] py-[3px] rounded-[20px] animate-fade-slide-up"
      style={config.style}
    >
      <Icon size={12} style={{ color: config.style.color }} />
      <span style={{ fontSize: '11px', fontWeight: 500, color: config.style.color }}>
        {config.label}
      </span>
    </span>
  )
}
