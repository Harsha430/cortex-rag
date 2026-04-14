export type Mode = 'general' | 'research'
export type ToolUsed = 'search_tool' | 'rag_tool' | 'python_repl_tool' | null

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  tool_used: ToolUsed
  timestamp: string
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'indexed' | 'error'
}

export interface AppState {
  messages: Message[]
  mode: Mode
  isLoading: boolean
  input: string
  uploadedFiles: UploadedFile[]
  uploadPanelOpen: boolean
}

export interface MockResponse {
  response: string
  tool_used: ToolUsed
}
