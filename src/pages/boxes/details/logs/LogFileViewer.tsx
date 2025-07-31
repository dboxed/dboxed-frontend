import { useState, useEffect, useRef } from "react"
import type { components } from "@/api/models/schema"
import { LazyLog } from "@melloware/react-logviewer"
import { envVars } from "@/env.ts";
import { useUnboxedApiEventSource } from "@/api/api.ts";

interface LogFileViewerProps {
  workspaceId: number
  boxId: number
  logFileName: string
}

export function LogFileViewer({ workspaceId, boxId, logFileName }: LogFileViewerProps) {
  const [logData, setLogData] = useState<string>("")
  const eventSourceRef = useRef<EventSource | null>(null)

  // Close EventSource on unmount or when log file changes
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [logFileName])

  const url = new URL(`/v1/workspaces/${workspaceId}/boxes/${boxId}/logs/stream`, envVars.VITE_API_URL)
  url.searchParams.set('file', logFileName)

  useUnboxedApiEventSource(url.toString(), {
    onopen: () => {
      setLogData("")
    },
    onmessage: e => {
      try {
        const data = JSON.parse(e.data)

        if (e.event == 'metadata') {
          console.log("metadata", data)
        } else if (e.event === 'logs' && data.lines) {
          // Handle log batch
          const logLines = data.lines.map((line: components["schemas"]["LogsLine"]) =>
            `${line.time} ${line.log}`
          ).join('\n')

          setLogData(prev => prev + logLines + '\n')
        } else if (e.event === 'error') {
          setLogData(prev => prev + 'ERROR while loading logs: ' + data.message + '\n')
        }
      } catch (error) {
        console.error('Error parsing log data:', error)
      }
    },
    onerror: (err) => {
      setLogData(prev => prev + 'ERROR while loading logs: ' + err.toString() + '\n')
    }
  })

  return (
    <div className="h-96 border rounded-md">
      <LazyLog
        text={logData}
        follow={true}
        enableSearch={true}
        enableHotKeys={true}
        enableVirtualization={true}
        style={{
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      />
    </div>
  )
} 