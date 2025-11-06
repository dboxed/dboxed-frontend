import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import type { components } from "@/api/models/schema"
import { formatTimeAgo } from "@/utils/time.ts"

interface InstanceSelectorProps {
  selectedLogId: string | null
  onLogIdChange: (logId: string) => void
  logFiles: components["schemas"]["LogMetadataModel"][]
}

export function InstanceSelector({ selectedLogId, onLogIdChange, logFiles }: InstanceSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Instance:</span>
      <Select
        value={selectedLogId || ""}
        onValueChange={(value) => onLogIdChange(value)}
        disabled={!logFiles.length}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select an instance" />
        </SelectTrigger>
        <SelectContent>
          {logFiles.map((logFile) => {
            const containerInfo = logFile.metadata?.container as Record<string, unknown>
            if (!containerInfo) {
              return <SelectItem key={logFile.id} value={logFile.id.toString()}>
                {logFile.fileName}
              </SelectItem>
            }
            const containerId = containerInfo?.ID as string | undefined
            const shortId = containerId ? containerId.substring(0, 6) : 'N/A'
            const createdAt = formatTimeAgo(containerInfo.Created as string)

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
