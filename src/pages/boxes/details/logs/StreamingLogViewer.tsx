import { useEffect, useRef, useState } from "react"
import type { components } from "@/api/models/dboxed-schema"
import { envVars } from "@/env.ts"
import { useDboxedApiEventSource } from "@/api/client.ts"
import { VirtualizedLogViewer } from "@/components/logs/VirtualizedLogViewer.tsx"

interface StreamingLogViewerProps {
  workspaceId: string
  logId: string | null
  since?: string
  follow?: boolean
  height?: string
  className?: string
}

const isoPattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.)(\d+)Z$/

export function StreamingLogViewer({
  workspaceId,
  logId,
  since,
  height,
  className
}: StreamingLogViewerProps) {
  const [logLines, setLogLines] = useState<string[]>([])
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
    const u = new URL(
      `/v1/workspaces/${workspaceId}/logs/${logId}/stream`,
      envVars.VITE_API_URL
    )
    if (since) {
      u.searchParams.set('since', since)
    }
    url = u.toString()
  }

  // When the URL changes, clear the logs
  useEffect(() => {
    if (url) {
      setLogLines([])
    } else {
      setLogLines(["Please select a log file"])
    }
  }, [url])

  const formatTime = (time: string) => {
    const m = isoPattern.exec(time)
    if (!m) {
      return time
    }
    try {
      let nano = m[2]
      while (nano.length < 9) nano = "0" + nano
      return `${m[1]}${nano}Z`
    } catch {
      return time
    }
  }

  const formatLine = (
    metadata: components["schemas"]["LogMetadataModel"] | null,
    line: components["schemas"]["LogsLine"]
  ) => {
    try {
      switch (metadata?.format) {
        case 'slog-json': {
          const parsed = JSON.parse(line.line)
          const keys = Object.keys(parsed).filter(x => x !== "time")
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
      setLogLines([])
    },
    onmessage: e => {
      try {
        const data = JSON.parse(e.data)

        if (e.event === 'metadata') {
          metadataHolder[0] = data
        } else if (e.event === 'logs-batch') {
          const newLines = data.lines.map((l: components["schemas"]["LogsLine"]) =>
            formatLine(metadataHolder[0], l)
          )
          setLogLines(prev => [...prev, ...newLines])
        } else if (e.event === "end-of-history") {
          setLogLines(prev => [...prev, "...end of history..."])
        } else if (e.event === 'error') {
          setLogLines(prev => [...prev, `ERROR while loading logs: ${data.message}`])
        }
      } catch (error) {
        console.error('Error parsing log data:', error)
      }
    },
    onerror: (err) => {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setLogLines(prev => [...prev, `ERROR while loading logs: ${errorMessage}`])
    }
  })

  return (
    <VirtualizedLogViewer
      lines={logLines}
      height={height}
      className={className}
    />
  )
}
