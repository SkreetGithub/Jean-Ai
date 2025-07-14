import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY =
  "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"

export async function GET() {
  try {
    // Simple test endpoint
    return NextResponse.json({
      success: true,
      message: "OpenAI API test endpoint is working!",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("OpenAI test error:", error)
    return NextResponse.json(
      {
        error: "Failed to test OpenAI API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json()

    // For now, return a simple response to avoid OpenAI API issues during build
    const responses = {
      haiku: "AI minds thinking\nSilicon dreams come alive\nFuture unfolds now",
      "bedtime-story":
        "Once upon a time, a magical unicorn named Sparkle danced through moonlit clouds, bringing sweet dreams to all the children below.",
      general: `You asked: "${prompt}". This is a test response from Jean AI.`,
    }

    const responseType = type as keyof typeof responses
    const result = responses[responseType] || responses.general

    return NextResponse.json({
      result,
      type: type || "general",
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process OpenAI request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
