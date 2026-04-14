import { Network } from 'lucide-react'
import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { ThinkingBubble } from './ThinkingBubble'
import { useAutoScroll } from '../hooks/useAutoScroll'

interface Props {
  messages: Message[]
  isLoading: boolean
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <Network
        size={56}
        style={{ color: 'rgba(124,106,247,0.25)' }}
        strokeWidth={1.5}
      />
      <h1
        className="mt-4"
        style={{ fontSize: '22px', fontWeight: 600, color: 'var(--primary)', marginBottom: '6px' }}
      >
        CortexRAG
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '20px' }}>
        Ask anything. Upload documents. Reason over knowledge.
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {[
          { label: 'RAG Retrieval', bg: 'var(--cyan-dim)', border: 'rgba(34,211,238,0.2)', color: 'var(--cyan)' },
          { label: 'Web Search', bg: 'var(--emerald-dim)', border: 'rgba(16,185,129,0.2)', color: 'var(--emerald)' },
          { label: 'Logic Engine', bg: 'var(--amber-dim)', border: 'rgba(245,158,11,0.2)', color: 'var(--amber)' },
        ].map(pill => (
          <span
            key={pill.label}
            className="px-[14px] py-1 rounded-[20px]"
            style={{
              fontSize: '12px',
              background: pill.bg,
              border: `1px solid ${pill.border}`,
              color: pill.color,
            }}
          >
            {pill.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useAutoScroll(messages, isLoading)

  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col"
      style={{ padding: '20px', scrollBehavior: 'smooth' }}
    >
      <div className="flex-1 w-full max-w-[780px] mx-auto flex flex-col">
        {messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <ThinkingBubble />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
