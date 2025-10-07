import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import type { components } from "@/api/models/schema"

interface InstanceSelectorProps {
  selectedLogId: number | null
  onLogIdChange: (logId: number) => void
  logFiles: components["schemas"]["LogMetadataModel"][]
}

export function InstanceSelector({ selectedLogId, onLogIdChange, logFiles }: InstanceSelectorProps) {
  const getCreationDate = (f: components["schemas"]["LogMetadataModel"]) => {
    const containerInfo = f.metadata?.container as Record<string, unknown>
    return containerInfo?.Created
      ? new Date(containerInfo.Created as string).getTime()
      : new Date(f.createdAt).getTime()
  }

  // Sort log files by creation date (newest first)
  const sortedLogFiles = [...logFiles].sort((a, b) => {
    return getCreationDate(b) - getCreationDate(a) // Descending order (newest first)
  })

  // Auto-select the newest item if nothing is selected
  useEffect(() => {
    if (!selectedLogId && sortedLogFiles.length > 0) {
      onLogIdChange(sortedLogFiles[0].id)
    }
  }, [selectedLogId, sortedLogFiles, onLogIdChange])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Instance:</span>
      <Select
        value={selectedLogId?.toString() || ""}
        onValueChange={(value) => onLogIdChange(parseInt(value))}
        disabled={!logFiles.length}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select an instance" />
        </SelectTrigger>
        <SelectContent>
          {sortedLogFiles.map((logFile) => {
            const containerInfo = logFile.metadata?.container as Record<string, unknown>
            if (!containerInfo) {
              return <SelectItem key={logFile.id} value={logFile.id.toString()}>
                {logFile.fileName}
              </SelectItem>
            }
            const containerId = containerInfo?.ID as string | undefined
            const shortId = containerId ? containerId.substring(0, 6) : 'N/A'
            const createdAt = new Date(containerInfo.Created as string).toLocaleString()

            return (
              <SelectItem key={logFile.id} value={logFile.id.toString()}>
                {createdAt} - {shortId}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
