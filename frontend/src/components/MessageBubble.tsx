import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'
import { ToolBadge } from './ToolBadge'

interface Props {
  message: Message
}

export function MessageBubble({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex flex-col items-end mb-4">
        <div
          className="max-w-[68%] px-4 py-[11px] rounded-[14px_14px_2px_14px]"
          style={{ background: 'var(--violet)' }}
        >
          <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6, margin: 0 }}>
            {message.content}
          </p>
        </div>
        <span
          className="mt-1 mr-1"
          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}
        >
          {message.timestamp}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: '28px',
          height: '28px',
          background: 'rgba(124,106,247,0.2)',
          alignSelf: 'flex-start',
          marginTop: '2px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--violet)' }}>C</span>
      </div>

      <div className="flex flex-col max-w-[78%]">
        <div
          className="rounded-[2px_14px_14px_14px] px-4 py-[14px]"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          {message.tool_used && (
            <div className="flex items-center gap-[6px] mb-2">
              <ToolBadge tool={message.tool_used} />
            </div>
          )}
          <div className="prose-cortex">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <span
          className="mt-1 ml-1"
          style={{ fontSize: '10px', color: 'var(--muted)' }}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  )
}
