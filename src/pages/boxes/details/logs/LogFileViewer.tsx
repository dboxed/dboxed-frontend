import { useEffect, useRef, useState } from "react"
import type { components } from "@/api/models/schema"
import { LazyLog } from "@melloware/react-logviewer"
import { envVars } from "@/env.ts";
import { useDboxedApiEventSource } from "@/api/api.ts";

interface LogFileViewerProps {
  workspaceId: number
  boxId: number
  logId: number | null
  since?: string
}

const isoPattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.)(\d+)Z$/;

export function LogFileViewer({ workspaceId, boxId, logId, since }: LogFileViewerProps) {
  const [logData, setLogData] = useState<string>("")
  const eventSourceRef = useRef<EventSource | null>(null)
  const [metadataHolder] = useState<(components["schemas"]["LogMetadataModel"] | null)[]>([null])

  // Close EventSource on unmount or when log file changes
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [logId])

  let url = ""
  if (logId) {
    const u = new URL(`/v1/workspaces/${workspaceId}/boxes/${boxId}/logs/${logId}/stream`, envVars.VITE_API_URL)
    if (since) {
      u.searchParams.set('since', since)
    }
    url = u.toString()
  }

  // when the url changes, clear the logs (the stream is going to be restarted)
  useEffect(() => {
    if (url) {
      setLogData("Loading...")
    } else {
      setLogData("Please select a log file")
    }
  }, [url]);

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

  const formatLine = (metadata: components["schemas"]["LogMetadataModel"] | null, line: components["schemas"]["LogsLine"]) => {
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

  useDboxedApiEventSource(url?.toString() || "", {
    enabled: !!logId && !!url,
    onopen: () => {
      // clear it before the first line gets received
      setLogData("")
    },
    onmessage: e => {
      try {
        const data = JSON.parse(e.data)

        if (e.event == 'metadata') {
          metadataHolder[0] = data
        } else if (e.event === 'logs-batch') {
          const newLines = data.lines.map((l: components["schemas"]["LogsLine"])  => formatLine(metadataHolder[0], l)).join('\n')
          setLogData(prev => prev + newLines + '\n')
        } else if (e.event === "end-of-history") {
          setLogData(prev => prev + "...end of history..." + '\n')
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