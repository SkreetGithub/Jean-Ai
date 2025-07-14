import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, Brain } from "lucide-react"
import { useHydrated } from "@/hooks/use-hydrated"
import VoiceActivationOverlay from "@/components/VoiceActivationOverlay"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function JeanAIWidget() {
  const isHydrated = useHydrated()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isTyping])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  // Handler for transcript from voice overlay
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    setIsVoiceOverlayOpen(false)
  }

  return (
    <div className="relative flex flex-col h-[500px] max-h-[60vh]">
      {/* Voice Activation Overlay */}
      <VoiceActivationOverlay open={isVoiceOverlayOpen} onTranscript={handleVoiceTranscript} />
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2 bg-[#23272f]" style={{scrollbarWidth:'thin'}}>
        {messages.length === 0 && (
          <div className="text-center text-[#b0b8c1]">Jean is waiting for your question...</div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-md text-sm ${
                message.role === "user"
                  ? "bg-[#61dafb] text-black self-end"
                  : "bg-[#181c23] text-white self-start border border-[#2d3748]"
              }`}
            >
              <div>{message.content}</div>
              {isHydrated && (
                <div className="text-xs opacity-60 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2 bg-[#181c23] text-white border border-[#2d3748] max-w-[60%] animate-pulse">
              Jean is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-[#181c23] border-t border-[#2d3748]">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message... or click the brain to speak"
          disabled={isLoading}
          className="flex-1 bg-[#23272f] border-[#444] text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) handleSubmit(e as any)
          }}
        />
        <Button
          type="button"
          onClick={() => setIsVoiceOverlayOpen(true)}
          className="bg-[#61dafb] text-black hover:bg-[#21a1f1]"
          title="Activate voice mode"
        >
          <Brain className="w-5 h-5" />
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#61dafb] text-black hover:bg-[#21a1f1]"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  )
} 