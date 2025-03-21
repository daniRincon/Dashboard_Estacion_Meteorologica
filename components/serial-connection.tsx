"use client"

import { Button } from "@/components/ui/button"
import { Cable } from "lucide-react"

interface SerialConnectionProps {
  connected: boolean
  onConnect: () => Promise<void>
  onDisconnect: () => Promise<void>
}

export default function SerialConnection({ connected, onConnect, onDisconnect }: SerialConnectionProps) {
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <Button variant="outline" onClick={onDisconnect} className="flex items-center gap-2">
          <Cable className="h-4 w-4" />
          Disconnect
        </Button>
      ) : (
        <Button onClick={onConnect} className="flex items-center gap-2">
          <Cable className="h-4 w-4" />
          Connect Device
        </Button>
      )}
    </div>
  )
}

