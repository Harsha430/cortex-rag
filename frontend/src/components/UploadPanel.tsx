import { useRef, useState, DragEvent } from 'react'
import { UploadCloud as CloudUpload, CheckCircle, XCircle, X, Loader } from 'lucide-react'
import { UploadedFile } from '../types'

interface Props {
  open: boolean
  files: UploadedFile[]
  onUpload: (file: File) => void
  onRemove: (id: string) => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function UploadPanel({ open, files, onUpload, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach(f => {
      if (f.type === 'application/pdf' || f.type === 'text/plain' || f.name.endsWith('.txt') || f.name.endsWith('.pdf')) {
        onUpload(f)
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    selected.forEach(f => onUpload(f))
    if (inputRef.current) inputRef.current.value = ''
  }

  const visibleFiles = files.slice(0, 5)
  const hiddenCount = Math.max(0, files.length - 5)

  return (
    <div
      style={{
        maxHeight: open ? '160px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 200ms ease',
      }}
    >
      <div
        className="flex gap-3 rounded-[12px] p-[14px_16px] mb-3"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-lg cursor-pointer flex-shrink-0 transition-all"
          style={{
            width: '180px',
            height: '72px',
            border: `1px dashed ${dragging ? 'var(--violet)' : 'rgba(255,255,255,0.12)'}`,
            background: 'rgba(255,255,255,0.02)',
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <CloudUpload
            size={20}
            style={{ color: dragging ? 'var(--violet)' : 'var(--muted)', transition: 'color 150ms' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            Drop PDF or TXT
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {visibleFiles.length === 0 && (
            <div className="flex items-center h-full">
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>No files uploaded yet</span>
            </div>
          )}
          {visibleFiles.map(file => (
            <div key={file.id} className="flex items-center gap-2 h-[26px]">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {file.status === 'uploading' && (
                  <Loader size={14} style={{ color: 'var(--violet)', flexShrink: 0 }} className="animate-spin-custom" />
                )}
                {file.status === 'indexed' && (
                  <CheckCircle size={14} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                )}
                {file.status === 'error' && (
                  <XCircle size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />
                )}
                <span
                  className="truncate"
                  style={{ fontSize: '12px', color: 'var(--primary)', maxWidth: '160px' }}
                >
                  {file.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0 }}>
                  {formatSize(file.size)}
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                flexShrink: 0,
                color: file.status === 'indexed' ? 'var(--emerald)'
                  : file.status === 'error' ? 'var(--red)'
                  : 'var(--muted)',
              }}>
                {file.status === 'uploading' ? 'Indexing...' : file.status === 'indexed' ? 'Indexed' : 'Failed'}
              </span>
              <button
                onClick={() => onRemove(file.id)}
                className="flex-shrink-0 transition-colors"
                style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {hiddenCount > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>+{hiddenCount} more</span>
          )}
        </div>
      </div>
    </div>
  )
}
