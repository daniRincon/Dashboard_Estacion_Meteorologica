"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thermometer, Droplets, Volume2, Wind } from 'lucide-react'
import { toast } from "sonner"
import SensorCard from "@/components/sensor-card"
import SensorChart from "@/components/sensor-chart"
import AIRecommendations from "@/components/ai-recommendations"
import SerialConnection from "@/components/serial-connection"

// Definir tipos para la API Web Serial sin modificar la interfaz Navigator global
interface SerialPortOptions {
  baudRate: number;
}

interface SerialPort {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  open: (options: SerialPortOptions) => Promise<void>;
  close: () => Promise<void>;
}

// Definir el tipo para los datos de sensores
interface SensorDataType {
  temperature: { current: number; history: number[] };
  humidity: { current: number; history: number[] };
  noise: { current: number; history: number[] };
  airQuality: { current: number; history: number[] };
}

export default function Dashboard() {
  const [connected, setConnected] = useState(false)
  const [serialPort, setSerialPort] = useState<SerialPort | null>(null)
  const [sensorData, setSensorData] = useState<SensorDataType>({
    temperature: { current: 22.5, history: [] },
    humidity: { current: 45, history: [] },
    noise: { current: 35, history: [] },
    airQuality: { current: 85, history: [] },
  })

  useEffect(() => {
    if (!connected) return
    
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: { 
          current: Math.round((prev.temperature.current + (Math.random() * 2 - 1)) * 10) / 10,
          history: [...prev.temperature.history, prev.temperature.current].slice(-20)
        },
        humidity: { 
          current: Math.min(100, Math.max(0, Math.round(prev.humidity.current + (Math.random() * 4 - 2)))),
          history: [...prev.humidity.history, prev.humidity.current].slice(-20)
        },
        noise: { 
          current: Math.min(100, Math.max(0, Math.round(prev.noise.current + (Math.random() * 6 - 3)))),
          history: [...prev.noise.history, prev.noise.current].slice(-20)
        },
        airQuality: { 
          current: Math.min(100, Math.max(0, Math.round(prev.airQuality.current + (Math.random() * 4 - 2)))),
          history: [...prev.airQuality.history, prev.airQuality.current].slice(-20)
        },
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [connected])

  const handleConnect = async () => {
    try {
      // Usar una aserción de tipo en lugar de modificar la interfaz Navigator
      const port = await (navigator as any).serial.requestPort() as SerialPort
      await port.open({ baudRate: 9600 })
      
      setSerialPort(port)
      setConnected(true)
      
      toast.success("Conectado a la estación meteorológica")
    } catch (error) {
      console.error(error)
      toast.error("No se pudo conectar con la estación meteorológica")
    }
  }

  const handleDisconnect = async () => {
    if (serialPort) {
      try {
        await serialPort.close()
        setSerialPort(null)
        setConnected(false)
        toast.success("Desconectado de la estación meteorológica")
      } catch (error) {
        console.error(error)
        toast.error("No se pudo desconectar de la estación meteorológica")
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Estación Meteorológica</h1>
        <SerialConnection 
          connected={connected} 
          onConnect={handleConnect} 
          onDisconnect={handleDisconnect} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SensorCard 
          title="Temperatura" 
          value={`${sensorData.temperature.current}°C`} 
          icon={<Thermometer className="h-5 w-5" />}
          status={getSensorStatus(sensorData.temperature.current, 15, 30)}
        />
        <SensorCard 
          title="Humedad" 
          value={`${sensorData.humidity.current}%`} 
          icon={<Droplets className="h-5 w-5" />}
          status={getSensorStatus(sensorData.humidity.current, 30, 70)}
        />
        <SensorCard 
          title="Nivel de Ruido" 
          value={`${sensorData.noise.current} dB`} 
          icon={<Volume2 className="h-5 w-5" />}
          status={getSensorStatus(sensorData.noise.current, 0, 50, true)}
        />
        <SensorCard 
          title="Calidad del Aire" 
          value={`${sensorData.airQuality.current}`} 
          icon={<Wind className="h-5 w-5" />}
          status={getSensorStatus(sensorData.airQuality.current, 50, 80, false)}
        />
      </div>

      <Tabs defaultValue="charts" className="mb-6">
        <TabsList>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones IA</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorChart 
              title="Historial de Temperatura" 
              data={sensorData.temperature.history} 
              unit="°C" 
              color="#3b82f6" 
            />
            <SensorChart 
              title="Historial de Humedad" 
              data={sensorData.humidity.history} 
              unit="%" 
              color="#06b6d4" 
            />
            <SensorChart 
              title="Historial de Nivel de Ruido" 
              data={sensorData.noise.history} 
              unit="dB" 
              color="#8b5cf6" 
            />
            <SensorChart 
              title="Historial de Calidad del Aire" 
              data={sensorData.airQuality.history} 
              unit="" 
              color="#10b981" 
            />
          </div>
        </TabsContent>
        <TabsContent value="recommendations">
          <AIRecommendations sensorData={sensorData} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Estado del Dispositivo</CardTitle>
          <CardDescription>Estado actual de tu estación meteorológica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Conectado' : 'Desconectado'}</span>
          </div>
          {connected && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Recibiendo datos del puerto COM</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getSensorStatus(value: number, min: number, max: number, inverted = false): 'normal' | 'warning' | 'alert' {
  if (inverted) {
    if (value > max) return 'alert'
    if (value > min) return 'warning'
    return 'normal'
  } else {
    if (value < min || value > max) return 'alert'
    if (value < min + 5 || value > max - 5) return 'warning'
    return 'normal'
  }
}