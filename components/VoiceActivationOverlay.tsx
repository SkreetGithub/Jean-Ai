import { useEffect, useRef, useState } from "react"
import BrainAnimation from "@/components/BrainAnimation"

interface VoiceActivationOverlayProps {
  open: boolean
  onTranscript: (transcript: string) => void
}

export default function VoiceActivationOverlay({ open, onTranscript }: VoiceActivationOverlayProps) {
  const [listening, setListening] = useState(false)
  const [recording, setRecording] = useState(false)
  const [status, setStatus] = useState("Listening for 'Hey Jean'...")
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Wake word detection loop
  useEffect(() => {
    if (!open) return
    setStatus("Listening for 'Hey Jean'...")
    setError(null)
    setListening(true)
    setRecording(false)
    let wakeActive = true
    const detectWakeWord = async () => {
      while (wakeActive && open) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const mediaRecorder = new MediaRecorder(stream)
          let chunks: Blob[] = []
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data)
          }
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' })
            const reader = new FileReader()
            reader.readAsDataURL(audioBlob)
            reader.onloadend = async () => {
              const base64Audio = reader.result as string
              // Call wake word API
              const res = await fetch('/api/wake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: base64Audio })
              })
              const data = await res.json()
              if (data.status === 'Wake word detected') {
                setStatus("Listening... (ask your question)")
                setListening(false)
                setRecording(true)
                startVoiceRecording()
                wakeActive = false
              } else {
                setStatus("Listening for 'Hey Jean'...")
                setListening(true)
                setRecording(false)
                setTimeout(detectWakeWord, 500)
              }
            }
          }
          mediaRecorder.start()
          setTimeout(() => mediaRecorder.stop(), 2000)
        } catch (err) {
          setError("Microphone error. Please allow access and retry.")
          setStatus("Listening for 'Hey Jean'...")
          break
        }
        await new Promise((res) => setTimeout(res, 2500))
      }
    }
    detectWakeWord()
    return () => { wakeActive = false }
  }, [open])

  // Voice recording and silence detection
  const startVoiceRecording = async () => {
    setStatus("Listening... (ask your question)")
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      let silenceTimer: NodeJS.Timeout | null = null
      let lastSoundTime = Date.now()
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          lastSoundTime = Date.now()
          if (silenceTimer) clearTimeout(silenceTimer)
          silenceTimer = setTimeout(() => {
            stopVoiceRecording()
          }, 1800)
        }
      }
      mediaRecorder.onstop = async () => {
        setRecording(false)
        setStatus("Transcribing...")
        setError(null)
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = async () => {
          const base64Audio = reader.result as string
          // Call voice API
          const res = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voice: base64Audio })
          })
          const data = await res.json()
          setStatus("Listening for 'Hey Jean'...")
          setListening(true)
          setRecording(false)
          if (data.transcript) {
            onTranscript(data.transcript)
          } else {
            setError("Sorry, I couldn't understand. Please try again.")
          }
        }
      }
      mediaRecorder.start()
    } catch (err) {
      setError("Microphone error. Please allow access and retry.")
      setStatus("Listening for 'Hey Jean'...")
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1d45]/90 transition-all duration-500">
      <div className={`transition-all duration-500 ${recording ? 'drop-shadow-[0_0_60px_#61dafb] scale-110' : listening ? 'drop-shadow-[0_0_30px_#61dafb] scale-105' : ''}`}>
        <BrainAnimation />
      </div>
      <div className="absolute bottom-24 left-0 right-0 text-center text-xl text-[#61dafb] font-bold animate-pulse pointer-events-none">
        {status}
      </div>
      {error && (
        <div className="absolute bottom-12 left-0 right-0 text-center text-red-400 font-semibold animate-fade-in pointer-events-none">
          {error}
        </div>
      )}
    </div>
  )
} 