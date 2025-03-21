"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ThermometerSun, Droplets, Volume2, Wind } from 'lucide-react'

interface SensorDataType {
  temperature: { current: number; history: number[] };
  humidity: { current: number; history: number[] };
  noise: { current: number; history: number[] };
  airQuality: { current: number; history: number[] };
}

interface AIRecommendationsProps {
  sensorData: SensorDataType;
}

export default function AIRecommendations({ sensorData }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // En una implementación real, esto llamaría a un endpoint de API que usa el AI SDK
    // para generar recomendaciones basadas en los datos del sensor
    const generateRecommendations = () => {
      setLoading(true)
      
      // Simular retraso de llamada a API
      setTimeout(() => {
        const newRecommendations: string[] = []
        
        // Recomendaciones de temperatura
        if (sensorData.temperature.current > 28) {
          newRecommendations.push("La temperatura es alta. Considera encender el aire acondicionado o abrir ventanas para una mejor ventilación.")
        } else if (sensorData.temperature.current < 18) {
          newRecommendations.push("La temperatura es baja. Considera encender la calefacción para mantener un ambiente confortable.")
        }
        
        // Recomendaciones de humedad
        if (sensorData.humidity.current > 65) {
          newRecommendations.push("Los niveles de humedad son altos. Considera usar un deshumidificador para prevenir el crecimiento de moho y mejorar el confort.")
        } else if (sensorData.humidity.current < 30) {
          newRecommendations.push("Los niveles de humedad son bajos. Considera usar un humidificador para prevenir la piel seca y problemas respiratorios.")
        }
        
        // Recomendaciones de ruido
        if (sensorData.noise.current > 60) {
          newRecommendations.push("Los niveles de ruido son altos. Considera identificar y reducir las fuentes de ruido o usar aislamiento acústico.")
        }
        
        // Recomendaciones de calidad del aire
        if (sensorData.airQuality.current < 50) {
          newRecommendations.push("La calidad del aire es deficiente. Considera mejorar la ventilación, usar un purificador de aire o identificar fuentes de contaminación.")
        }
        
        // Recomendación general si todo está bien
        if (newRecommendations.length === 0) {
          newRecommendations.push("Todos los parámetros ambientales están dentro de rangos óptimos. Continúa manteniendo las condiciones actuales.")
        }
        
        setRecommendations(newRecommendations)
        setLoading(false)
      }, 1500)
    }
    
    generateRecommendations()
  }, [sensorData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recomendaciones de IA
        </CardTitle>
        <CardDescription>
          Sugerencias inteligentes basadas en tus datos ambientales
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex gap-3 rounded-lg border p-3">
                {recommendation.includes("temperatura") ? (
                  <ThermometerSun className="h-5 w-5 text-orange-500" />
                ) : recommendation.includes("humedad") ? (
                  <Droplets className="h-5 w-5 text-blue-500" />
                ) : recommendation.includes("ruido") ? (
                  <Volume2 className="h-5 w-5 text-purple-500" />
                ) : recommendation.includes("aire") ? (
                  <Wind className="h-5 w-5 text-green-500" />
                ) : (
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                )}
                <p>{recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}