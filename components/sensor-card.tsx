import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SensorCardProps {
  title: string
  value: string
  icon: React.ReactNode
  status: "normal" | "warning" | "alert"
}

export default function SensorCard({ title, value, icon, status }: SensorCardProps) {
  const statusColors = {
    normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    alert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card className="overflow-hidden">
      <div
        className={`h-1 ${status === "normal" ? "bg-green-500" : status === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
      ></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[status]}`}
        >
          {status === "normal" ? "Normal" : status === "warning" ? "Warning" : "Alert"}
        </div>
      </CardContent>
    </Card>
  )
}