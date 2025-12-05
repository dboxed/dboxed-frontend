import { useEffect, useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { InstanceSelector } from "./InstanceSelector.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { StreamingLogViewer } from "@/pages/boxes/details/logs/StreamingLogViewer.tsx";

interface LogViewerWithControlsProps {
  workspaceId: string
  logFiles: components["schemas"]["LogMetadataModel"][]
}

const getLogCreationDate = (f: components["schemas"]["LogMetadataModel"]) => {
  const containerInfo = f.metadata?.container as Record<string, unknown>
  return containerInfo?.Created
    ? new Date(containerInfo.Created as string).getTime()
    : new Date(f.createdAt).getTime()
}

export function LogViewerWithControls({ workspaceId, logFiles }: LogViewerWithControlsProps) {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [logsSince, setLogsSince] = useState<string>("1h")

  // Sort log files by creation date (newest first)
  const sortedLogFiles = useMemo(() => [...logFiles].sort((a, b) => {
    return getLogCreationDate(b) - getLogCreationDate(a) // Descending order (newest first)
  }), [logFiles])

  useEffect(() => {
    const s = sortedLogFiles.find(m => m.id == selectedLogId)
    if (!s) {
      if (sortedLogFiles.length) {
        setSelectedLogId(sortedLogFiles[0].id)
      } else {
        setSelectedLogId(null)
      }
    }
  }, [sortedLogFiles, selectedLogId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {sortedLogFiles.length > 1 && (
          <InstanceSelector
            selectedLogId={selectedLogId}
            onLogIdChange={setSelectedLogId}
            logFiles={sortedLogFiles}
          />
        )}

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

      <StreamingLogViewer
        workspaceId={workspaceId}
        logId={selectedLogId}
        since={logsSince}
        follow={true}
        height="h-96"
      />
    </div>
  )
}
