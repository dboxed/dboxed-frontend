import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useUnboxedQueryClient } from "@/api/api.ts"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.tsx"
import { Box, Container } from "lucide-react"
import type { components } from "@/api/models/schema"
import { LogFileViewer } from "./LogFileViewer.tsx"

interface LogsPageProps {
  boxId: number
}

function getLogFileDisplayName(logFile: components["schemas"]["LogMetadata"]): string {

  const containerInfo = logFile.metadata?.container as any
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

export function LogsPage({ boxId }: LogsPageProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()
  const [selectedLogFile, setSelectedLogFile] = useState<string | null>(null)

  // Fetch available log files
  const logFiles = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/logs", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: boxId,
      }
    },
  }, {
    refetchInterval: 10000,
  })

  const handleLogFileChange = (value: string) => {
    setSelectedLogFile(value)
  }

  if (!workspaceId) {
    return <>no workspace</>
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 h-full">
          {logFiles.data?.items && logFiles.data.items.length > 0 ? (
            <Table className="">
              <TableBody>
                {logFiles.data.items.map((logFile: components["schemas"]["LogMetadata"]) => {
                  const displayName = getLogFileDisplayName(logFile)
                  const icon = getLogFileIcon(logFile)
                  
                  return (
                    <TableRow
                      key={logFile.fileName}
                      onClick={() => handleLogFileChange(logFile.fileName)}
                      className={`cursor-pointer ${selectedLogFile === logFile.fileName ? 'bg-primary/10' : ''}`}
                    >
                      <TableCell className="text-sm w-full" title={displayName}>
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-4 flex items-center justify-center">
                            {icon}
                          </div>
                          <span className="truncate">{displayName}</span>
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

          <div className="col-span-3">
            <LogFileViewer
              workspaceId={workspaceId}
              boxId={boxId}
              logFileName={selectedLogFile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 