import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Box, Container } from "lucide-react"
import type { components } from "@/api/models/schema"
import { LogFileViewer } from "./LogFileViewer.tsx"

interface LogsPageProps {
  box: components["schemas"]["Box"]
}

function getLogEntryName(logFile: components["schemas"]["LogMetadata"]): string {
  const containerInfo = logFile.metadata?.container as Record<string, unknown>
  if (logFile.format === "docker-logs" && containerInfo?.Name) {
    return containerInfo.Name as string
  }
  
  return logFile.fileName
}

function getLogFileIcon(logFile: components["schemas"]["LogMetadata"]) {
  switch (logFile.format) {
    case 'slog-json':
      return <Box className="h-4 w-4" />
    case 'docker-logs':
      return <Container className="h-4 w-4" />
    default:
      return null
  }
}

export function LogsPage({ box }: LogsPageProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [selectedLogFile, setSelectedLogFile] = useState<string | null>(null)
  const [selectedEntryName, setSelectedEntryName] = useState<string | null>(null)

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
    const entryLogFiles = getLogFilesForEntry(entryName)
    if (entryLogFiles.length > 0) {
      setSelectedLogFile(entryLogFiles[0].fileName)
    }
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
  }, {} as Record<string, components["schemas"]["LogMetadata"][]>) : {}

  const entryNames = Object.keys(entryGroups)
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Log file:</span>
                <Select
                  value={selectedLogFile || ""}
                  onValueChange={setSelectedLogFile}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a log file" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEntryLogFiles.map((logFile) => (
                      <SelectItem key={logFile.fileName} value={logFile.fileName}>
                        {logFile.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <LogFileViewer
                workspaceId={workspaceId}
                boxId={box.id}
                logFileName={selectedLogFile}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 