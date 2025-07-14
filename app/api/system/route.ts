import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Since we're on Vercel, we'll simulate system info
    // In a real deployment, you might want to get actual server metrics
    const systemInfo = {
      cpu: Math.floor(Math.random() * 30) + 10, // Simulated 10-40% CPU usage
      memory: Math.floor(Math.random() * 40) + 20, // Simulated 20-60% memory usage
      disk: Math.floor(Math.random() * 20) + 30, // Simulated 30-50% disk usage
      timestamp: new Date().toISOString(),
      platform: "Vercel Edge Runtime",
    }

    return NextResponse.json(systemInfo)
  } catch (error) {
    console.error("System API error:", error)
    return NextResponse.json({ error: "Failed to get system information" }, { status: 500 })
  }
}
