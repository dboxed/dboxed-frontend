import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Box, Container, HardDrive } from "lucide-react"
import type { components } from "@/api/models/schema"
import { LogFileViewer } from "./LogFileViewer.tsx"
import { InstanceSelector } from "./InstanceSelector.tsx"

interface LogsPageProps {
  box: components["schemas"]["Box"]
}

function getLogEntryName(logFile: components["schemas"]["LogMetadataModel"]): string {
  // Check for volume metadata
  const volumeInfo = logFile.metadata?.volume as Record<string, unknown>
  if (volumeInfo) {
    return volumeInfo.name as string
  }

  // Check for container name
  const containerInfo = logFile.metadata?.container as Record<string, unknown>
  if (logFile.format === "docker-logs" && containerInfo?.Name) {
    return containerInfo.Name as string
  }

  return logFile.fileName
}

function getLogFileIcon(logFile: components["schemas"]["LogMetadataModel"]) {
  // Check for volume metadata first
  const volumeInfo = logFile.metadata?.volume as Record<string, unknown>
  if (volumeInfo) {
    return <HardDrive className="h-4 w-4" />
  }

  switch (logFile.format) {
    case 'slog-json':
      return <Box className="h-4 w-4" />
    case 'docker-logs':
      return <Container className="h-4 w-4" />
    default:
      return null
  }
}

function getLogFileCategory(logFile: components["schemas"]["LogMetadataModel"]): 'service' | 'container' | 'volume' | 'other' {
  // Check for volume metadata
  const volumeInfo = logFile.metadata?.volume as Record<string, unknown>
  if (volumeInfo) {
    return 'volume'
  }

  // Check for container logs
  if (logFile.format === 'docker-logs') {
    return 'container'
  }

  // Check for service logs
  if (logFile.format === 'slog-json') {
    return 'service'
  }

  return 'other'
}

export function LogsPage({ box }: LogsPageProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null)
  const [selectedEntryName, setSelectedEntryName] = useState<string | null>(null)
  const [logsSince, setLogsSince] = useState<string>("1h")

  // Fetch available log files
  const logFiles = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/logs", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: box.id,
      }
    },
  }, {
    refetchInterval: 10000,
  })

  const handleLogEntryChange = (entryName: string) => {
    setSelectedEntryName(entryName)
    setSelectedLogId(null)
  }

  const getLogFilesForEntry = (entryName: string) => {
    if (!logFiles.data?.items) return []
    return logFiles.data.items.filter(logFile => getLogEntryName(logFile) === entryName)
  }

  // Group log files by entry name
  const entryGroups = logFiles.data?.items ? logFiles.data.items.reduce((acc, logFile) => {
    const entryName = getLogEntryName(logFile)
    if (!acc[entryName]) {
      acc[entryName] = []
    }
    acc[entryName].push(logFile)
    return acc
  }, {} as Record<string, components["schemas"]["LogMetadataModel"][]>) : {}

  // Sort entry names by category: service -> container -> volume -> other
  const categoryOrder = { 'service': 1, 'container': 2, 'volume': 3, 'other': 4 }
  const entryNames = Object.keys(entryGroups).sort((a, b) => {
    const categoryA = getLogFileCategory(entryGroups[a][0])
    const categoryB = getLogFileCategory(entryGroups[b][0])
    const orderA = categoryOrder[categoryA]
    const orderB = categoryOrder[categoryB]

    if (orderA !== orderB) {
      return orderA - orderB
    }

    // Within same category, sort alphabetically
    return a.localeCompare(b)
  })

  const selectedEntryLogFiles = selectedEntryName ? getLogFilesForEntry(selectedEntryName) : []

  if (!workspaceId) {
    return <>no workspace</>
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 h-full">
          <div className="max-h-96 overflow-y-auto">
            {entryNames.length > 0 ? (
              <Table className="">
                <TableBody>
                  {entryNames.map((entryName) => {
                    const logFiles = entryGroups[entryName]
                    const sampleLogFile = logFiles[0]
                    const icon = getLogFileIcon(sampleLogFile)
                    
                    return (
                      <TableRow
                        key={entryName}
                        onClick={() => handleLogEntryChange(entryName)}
                        className={`cursor-pointer ${selectedEntryName === entryName ? 'bg-primary/10' : ''}`}
                      >
                        <TableCell className="text-sm w-full" title={entryName}>
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-4 flex items-center justify-center">
                              {icon}
                            </div>
                            <span className="truncate">{entryName}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {logFiles.length}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No log files yet
              </div>
            )}
          </div>

          <div className="col-span-3">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <InstanceSelector
                  selectedLogId={selectedLogId}
                  onLogIdChange={setSelectedLogId}
                  logFiles={selectedEntryLogFiles}
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
                boxId={box.id}
                logId={selectedLogId}
                since={logsSince}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 