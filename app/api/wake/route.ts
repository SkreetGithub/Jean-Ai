import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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"

export async function POST(req: NextRequest) {
  try {
    const { audio } = await req.json()

    if (!audio) {
      return NextResponse.json({ error: "No audio data provided" }, { status: 400 })
    }

    // Decode base64 audio
    const audioData = audio.replace(/^data:audio\/\w+;base64,/, '')
    const audioBuffer = Buffer.from(audioData, 'base64')

    // Create form data for OpenAI Whisper API
    const formData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
    formData.append('file', audioBlob, 'audio.wav')
    formData.append('model', 'whisper-1')

    // Call OpenAI Whisper API for transcription
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData
    })

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${whisperResponse.status}`)
    }

    const data = await whisperResponse.json()
    const transcript = data.text || ""

    // Check for wake word "hey jean"
    const wakeWordDetected = transcript.toLowerCase().includes("hey jean") || 
                            transcript.toLowerCase().includes("hello jean") ||
                            transcript.toLowerCase().includes("hi jean")

    if (wakeWordDetected) {
      return NextResponse.json({ 
        status: "Wake word detected",
        transcript: transcript
      })
    } else {
      return NextResponse.json({ 
        status: "Wake word not detected",
        transcript: transcript
      })
    }
  } catch (error) {
    console.error("Wake word API error:", error)
    return NextResponse.json({ error: "Failed to process wake word detection" }, { status: 500 })
  }
} 