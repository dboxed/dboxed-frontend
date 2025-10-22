import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { LogFileViewer } from "./LogFileViewer.tsx"
import { InstanceSelector } from "./InstanceSelector.tsx"
import type { components } from "@/api/models/schema"

interface LogViewerWithControlsProps {
  workspaceId: number
  boxId: number
  logFiles: components["schemas"]["LogMetadataModel"][]
}

export function LogViewerWithControls({ workspaceId, boxId, logFiles }: LogViewerWithControlsProps) {
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)
  const [logsSince, setLogsSince] = useState<string>("1h")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <InstanceSelector
          selectedLogId={selectedLogId}
          onLogIdChange={setSelectedLogId}
          logFiles={logFiles}
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Logs since:</span>
          <Select
            value={logsSince}
            onValueChange={setLogsSince}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="12h">12h</SelectItem>
              <SelectItem value="24h">1d</SelectItem>
              <SelectItem value="168h">7d</SelectItem>
              <SelectItem value="720h">30d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <LogFileViewer
        workspaceId={workspaceId}
        boxId={boxId}
        logId={selectedLogId}
        since={logsSince}
      />
    </div>
  )
}
