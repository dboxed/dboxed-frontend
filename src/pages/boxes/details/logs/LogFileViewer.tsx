import { useEffect, useRef, useState } from "react"
import type { components } from "@/api/models/schema"
import { LazyLog } from "@melloware/react-logviewer"
import { envVars } from "@/env.ts";
import { useDboxedApiEventSource } from "@/api/api.ts";

interface LogFileViewerProps {
  workspaceId: number
  boxId: number
  logFileName: string | null
}

const isoPattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.)(\d+)Z$/;

export function LogFileViewer({ workspaceId, boxId, logFileName }: LogFileViewerProps) {
  const [logData, setLogData] = useState<string>("")
  const eventSourceRef = useRef<EventSource | null>(null)
  const [metadataHolder] = useState<(components["schemas"]["LogMetadata"] | null)[]>([null])

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
  if (logFileName) {
    url.searchParams.set('file', logFileName)
  }

  // when the url changes, clear the logs (the stream is going to be restarted)
  useEffect(() => {
    if (logFileName) {
      setLogData("Loading...")
    } else {
      setLogData("Please select a log file")
    }
  }, [url.toString()]);

  const formatTime = (time: string) => {
    const m = isoPattern.exec(time)
    if (!m) {
      return time
    }
    try {
      let nano = m[2]
      while (nano.length < 9) nano = "0" + nano;
      return `${m[1]}${nano}Z`
    } catch {
      return time
    }
  }

  const formatLine = (metadata: components["schemas"]["LogMetadata"] | null, line: components["schemas"]["LogsLine"]) => {
    try {
      switch (metadata?.format) {
        case 'slog-json': {
          const parsed = JSON.parse(line.line)
          const keys = Object.keys(parsed).filter(x => x != "time")
          let ret = formatTime(parsed.time)
          keys.forEach((k) => {
            const v = parsed[k]
            ret += ` ${k}=${JSON.stringify(v)}`
          })
          return ret
        }
        case 'docker-logs': {
          const parsed = JSON.parse(line.line)
          return `${formatTime(parsed.time)} ${parsed.stream} ${parsed.log.trimEnd()}`
        }
        default:
          return `${formatTime(line.time)} ${line.line}`
      }
    } catch {
      return `${formatTime(line.time)} ${line.line}`
    }
  }

  useDboxedApiEventSource(url.toString(), {
    enabled: !!logFileName,
    onopen: () => {
      // clear it before the first line gets received
      setLogData("")
    },
    onmessage: e => {
      try {
        const data = JSON.parse(e.data)

        if (e.event == 'metadata') {
          metadataHolder[0] = data
        } else if (e.event === 'logs' && data.lines) {
          // Handle log batch
          const logLines = data.lines.map((line: components["schemas"]["LogsLine"]) =>
            formatLine(metadataHolder[0], line)
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