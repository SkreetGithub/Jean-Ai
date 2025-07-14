import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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"

export async function POST(req: NextRequest) {
  try {
    const { voice } = await req.json()

    if (!voice) {
      return NextResponse.json({ error: "No voice data provided" }, { status: 400 })
    }

    // Decode base64 audio
    const audioData = voice.replace(/^data:audio\/\w+;base64,/, '')
    const audioBuffer = Buffer.from(audioData, 'base64')

    // Create form data for OpenAI Whisper API
    const formData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' })
    formData.append('file', audioBlob, 'audio.wav')
    formData.append('model', 'whisper-1')

    // Call OpenAI Whisper API
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

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
