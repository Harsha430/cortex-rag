import { useRef, useEffect, KeyboardEvent } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { Mode } from '../types'

interface Props {
  input: string
  mode: Mode
  isLoading: boolean
  onChange: (val: string) => void
  onSubmit: () => void
  onStop: () => void
}

const MAX_CHARS = 2000

export function InputBar({ input, mode, isLoading, onChange, onSubmit, onStop }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [input])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) onSubmit()
    }
  }

  const charCount = input.length
  const charCountColor =
    charCount >= 1950 ? 'var(--red)'
    : charCount >= 1800 ? 'var(--amber)'
    : 'var(--muted)'

  const dotColor = mode === 'general' ? 'var(--violet)' : 'var(--cyan)'
  const canSend = !isLoading && input.trim().length > 0

  return (
    <div
      className="flex flex-col rounded-[12px] px-3 py-[10px] gap-2"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        transition: 'border-color 150ms',
      }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="flex items-end gap-2">
        <div
          className="flex-shrink-0 mb-[10px]"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: dotColor,
            transition: 'background 150ms',
          }}
        />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => onChange(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Ask CortexRAG anything..."
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            color: 'var(--primary)',
            lineHeight: 1.5,
            maxHeight: '120px',
            overflowY: 'auto',
            padding: 0,
          }}
          className="placeholder-[var(--muted)]"
        />
        <button
          onClick={isLoading ? onStop : onSubmit}
          disabled={!isLoading && !canSend}
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all active:scale-95"
          style={{
            width: '36px',
            height: '36px',
            background: canSend || isLoading ? 'var(--violet)' : 'rgba(124,106,247,0.3)',
            cursor: canSend || isLoading ? 'pointer' : 'not-allowed',
            border: 'none',
            transition: 'background 150ms, transform 100ms',
          }}
          onMouseEnter={e => {
            if (canSend || isLoading) e.currentTarget.style.background = '#8f7ef9'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = canSend || isLoading ? 'var(--violet)' : 'rgba(124,106,247,0.3)'
          }}
        >
          {isLoading
            ? <Square size={14} style={{ color: '#fff' }} fill="#fff" />
            : <ArrowUp size={16} style={{ color: '#fff' }} />
          }
        </button>
      </div>

      <div className="flex items-center justify-between px-[2px]">
        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
          Press Enter to send · Shift+Enter for new line
        </span>
        <span style={{ fontSize: '10px', color: charCountColor, transition: 'color 150ms' }}>
          {charCount} / {MAX_CHARS}
        </span>
      </div>
    </div>
  )
}
