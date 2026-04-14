import { useState, useCallback } from 'react'
import { UploadedFile } from '../types'

const UPLOAD_ENDPOINT = 'http://localhost:8000/upload'

export function useUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const uploadFile = useCallback(async (file: File) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`

    setUploadedFiles(prev => [...prev, {
      id,
      name: file.name,
      size: file.size,
      status: 'uploading',
    }])

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(UPLOAD_ENDPOINT, { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      setUploadedFiles(prev =>
        prev.map(f => f.id === id ? { ...f, status: 'indexed' } : f)
      )
    } catch {
      setUploadedFiles(prev =>
        prev.map(f => f.id === id ? { ...f, status: 'error' } : f)
      )
    }
  }, [])

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  return { uploadedFiles, uploadFile, removeFile }
}
