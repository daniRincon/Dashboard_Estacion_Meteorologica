import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { sensorData } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an environmental monitoring assistant. Based on the following sensor readings, provide 
        practical recommendations for improving the environment. Keep recommendations concise and actionable.
        
        Temperature: ${sensorData.temperature.current}°C
        Humidity: ${sensorData.humidity.current}%
        Noise Level: ${sensorData.noise.current} dB
        Air Quality Index: ${sensorData.airQuality.current}
        
        Provide up to 3 specific recommendations based on these readings.
      `,
    })

    // Parse the recommendations into an array
    const recommendations = text
      .split(/\d+\./)
      .filter((item) => item.trim().length > 0)
      .map((item) => item.trim())

    return Response.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}

