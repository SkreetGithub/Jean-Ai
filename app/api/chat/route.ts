import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    const userInput = lastMessage?.content || ""

    if (!userInput.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Jean, a helpful and friendly AI assistant. Be conversational, helpful, and engaging in your responses."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const data = await openaiResponse.json()
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at the moment."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
