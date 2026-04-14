import { useRef, useEffect } from 'react'
import { Message } from '../types'

export function useAutoScroll(messages: Message[], isLoading: boolean) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return bottomRef
}
