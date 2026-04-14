import { useState, useCallback, useRef } from 'react'
import { Message, Mode, ToolUsed, MockResponse } from '../types'

const CHAT_ENDPOINT = 'http://localhost:8000/chat'

const mockResponses: MockResponse[] = [
  { response: "Based on the uploaded document, the key findings suggest that neural networks with hybrid retrieval architectures can outperform traditional models by **37%** on benchmark tasks. The contextual grounding provided by the knowledge base significantly reduces hallucination rates.", tool_used: 'rag_tool' },
  { response: "According to recent web sources, the current state of large language model research is evolving rapidly. Several labs have published findings this quarter on **reasoning capabilities** and multi-modal architectures that challenge previous benchmarks.\n\n> *Note: This information is sourced from live web data and may reflect the most recent publications.*", tool_used: 'search_tool' },
  { response: "Computing the result step by step:\n\n```\n847 × 23 = 19,481\n```\n\nThe logic execution confirms this. Breaking it down:\n- `847 × 20 = 16,940`\n- `847 × 3 = 2,541`\n- `16,940 + 2,541 = **19,481**`", tool_used: 'python_repl_tool' },
  { response: "I can help with that. Let me reason through this step by step.\n\nThe question touches on several interconnected concepts:\n\n1. **Retrieval-Augmented Generation (RAG)** — grounding responses in source documents\n2. **Agentic reasoning** — chaining multi-step logic to arrive at conclusions\n3. **Context compression** — efficiently passing relevant chunks to the model\n\nEach of these mechanisms can be composed to produce more accurate and verifiable outputs.", tool_used: null },
]

function getMockResponse(msg: string): Promise<MockResponse> {
  void msg
  const idx = Math.floor(Math.random() * mockResponses.length)
  return new Promise(resolve => setTimeout(() => resolve(mockResponses[idx]), 1600 + Math.random() * 600))
}

function formatTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<Mode>('general')
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [isMockMode, setIsMockMode] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      tool_used: null,
      timestamp: formatTimestamp(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map(m => ({ role: m.role, content: m.content })),
          mode,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json() as { response: string; tool_used: ToolUsed }

      setIsMockMode(false)
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.response,
        tool_used: data.tool_used,
        timestamp: formatTimestamp(),
      }])
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages(prev => prev.slice(0, -0))
        setIsLoading(false)
        return
      }

      const mock = await getMockResponse(text).catch(() => null)
      if (mock) {
        setIsMockMode(true)
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: mock.response,
          tool_used: mock.tool_used,
          timestamp: formatTimestamp(),
        }])
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [isLoading, messages, mode])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clearSession = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setIsLoading(false)
    setMode('general')
    setIsMockMode(false)
  }, [])

  return {
    messages,
    mode,
    setMode,
    isLoading,
    input,
    setInput,
    sendMessage,
    stopGeneration,
    clearSession,
    isMockMode,
  }
}
