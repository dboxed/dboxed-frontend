import { useState } from "react"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.tsx"
import { HardDrive } from "lucide-react"
import { FaDocker } from "react-icons/fa";
import type { components } from "@/api/models/dboxed-schema"
import { LogViewerWithControls } from "./LogViewerWithControls.tsx"

import DBoxedIcon from "/public/dboxed-icon.svg?react";

interface LogsPageProps {
  box: components["schemas"]["Box"]
}

function getLogEntryGroup(logFile: components["schemas"]["LogMetadataModel"]): string {
  const parts = logFile.fileName.split('/')
  if (parts.length >= 2) {
    return parts.slice(0, 2).join("/")
  }
  return logFile.fileName
}

function getLogFileIcon(logFile: components["schemas"]["LogMetadataModel"]) {
  const category = getLogFileCategory(logFile)

  switch (category) {
    case 'dboxed':
      return <DBoxedIcon className="h-4 w-4" />
    case 'container':
      return <FaDocker className="h-4 w-4" />
    case 'volume':
      return <HardDrive className="h-4 w-4" />
    default:
      return null
  }
}

function getLogFileCategory(logFile: components["schemas"]["LogMetadataModel"]): 'dboxed' | 'container' | 'volume' | 'other' {
  // Determine category based on path prefix
  if (logFile.fileName.startsWith('containers/')) {
    return 'container'
  }

  if (logFile.fileName.startsWith('volumes/')) {
    return 'volume'
  }

  if (logFile.fileName.startsWith('dboxed/')) {
    return 'dboxed'
  }

  return 'other'
}

export function LogsPage({ box }: LogsPageProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
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
  }

  const getLogFilesForEntry = (entryName: string) => {
    if (!logFiles.data?.items) return []
    return logFiles.data.items.filter(logFile => getLogEntryGroup(logFile) === entryName)
  }

  // Group log files
  const entryGroups = logFiles.data?.items ? logFiles.data.items.reduce((acc, logFile) => {
    const entryName = getLogEntryGroup(logFile)
    if (!acc[entryName]) {
      acc[entryName] = []
    }
    acc[entryName].push(logFile)
    return acc
  }, {} as Record<string, components["schemas"]["LogMetadataModel"][]>) : {}

  // Sort entry names by category: dboxed -> container -> volume -> other
  const categoryOrder = { 'dboxed': 1, 'container': 2, 'volume': 3, 'other': 4 }
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
            <LogViewerWithControls
              workspaceId={workspaceId}
              boxId={box.id}
              logFiles={selectedEntryLogFiles}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 