"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SensorChartProps {
  title: string
  data: number[]
  unit: string
  color: string
}

export default function SensorChart({ title, data, unit, color }: SensorChartProps) {
  // Convert the data array to the format expected by Recharts
  const chartData = data.map((value, index) => ({
    time: index,
    value: value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickFormatter={(value) => `${data.length - value}m`} style={{ fontSize: "12px" }} />
              <YAxis style={{ fontSize: "12px" }} tickFormatter={(value) => `${value}${unit}`} />
              <Tooltip formatter={(value) => [`${value}${unit}`, "Value"]} labelFormatter={() => ""} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

