import { useEffect, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils.ts"

interface VirtualizedLogViewerProps {
  lines: string[]
  height?: string
  className?: string
}

export function VirtualizedLogViewer({
  lines,
  height = "h-96",
  className
}: VirtualizedLogViewerProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [requestScrollToBottom, setRequestScrollToBottom] = useState(false)

  // Filter and search logic
  const { filteredLines, matchedIndices } = useMemo(() => {
    if (!searchQuery) {
      return {
        filteredLines: lines.map((line, index) => ({ line, originalIndex: index })),
        matchedIndices: []
      }
    }

    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')

    const matched: number[] = []
    const filtered = lines
      .map((line, index) => ({ line, originalIndex: index }))
      .filter(({ line }) => {
        const isMatch = regex.test(line)
        if (isMatch) matched.push(lines.indexOf(line))
        return isMatch
      })

    return { filteredLines: filtered, matchedIndices: matched }
  }, [lines, searchQuery])

  // Virtualizer setup
  const virtualizer = useVirtualizer({
    count: filteredLines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
    overscan: 10,
  })

  const isNearBottom = !!parentRef.current && parentRef.current.scrollHeight - parentRef.current.scrollTop - parentRef.current.clientHeight < 100

  // Smart follow mode
  useEffect(() => {
    if (filteredLines.length === 0) return

    if (isNearBottom) {
      // can't directly do the scroll here as it will fail, so we do it on next render
      setRequestScrollToBottom(true)
    }
  }, [filteredLines.length, virtualizer, isNearBottom])

  useEffect(() => {
    if (!requestScrollToBottom) {
      return
    }
    setRequestScrollToBottom(false)
    virtualizer.scrollToIndex(filteredLines.length - 1, {
      align: 'end',
      behavior: 'auto',
    })
  }, [filteredLines.length, requestScrollToBottom, virtualizer]);

  // Navigate search matches
  const goToMatch = (direction: 'next' | 'prev') => {
    if (matchedIndices.length === 0) return

    let newIndex = currentMatchIndex
    if (direction === 'next') {
      newIndex = (currentMatchIndex + 1) % matchedIndices.length
    } else {
      newIndex = currentMatchIndex === 0 ? matchedIndices.length - 1 : currentMatchIndex - 1
    }

    setCurrentMatchIndex(newIndex)

    // Find the position in filtered lines
    const targetOriginalIndex = matchedIndices[newIndex]
    const targetFilteredIndex = filteredLines.findIndex(
      ({ originalIndex }) => originalIndex === targetOriginalIndex
    )

    if (targetFilteredIndex >= 0) {
      virtualizer.scrollToIndex(targetFilteredIndex, {
        align: 'center',
        behavior: 'smooth',
      })
    }
  }

  const jumpToBottom = () => {
    virtualizer.scrollToIndex(filteredLines.length - 1, {
      align: 'end',
      behavior: 'auto',
    })
  }

  // Highlight search matches in line
  const highlightLine = (line: string) => {
    if (!searchQuery) return <>{line}</>

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')

    const parts = line.split(regex)
    return (
      <span>
        {parts.map((part, i) => {
          if (regex.test(part)) {
            return (
              <mark key={i} className="bg-yellow-400 text-black">
                <>{part}</>
              </mark>
            )
          }
          return <>{part}</>
        })}
      </span>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Search bar and controls */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <Input
          type="text"
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentMatchIndex(0)
          }}
          className="flex-1"
        />

        {matchedIndices.length > 0 && (
          <>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentMatchIndex + 1} / {matchedIndices.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToMatch('prev')}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToMatch('next')}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={jumpToBottom}
          className="gap-2"
          disabled={isNearBottom}
        >
          <ChevronDown className="h-4 w-4" />
          Jump To Bottom
        </Button>
      </div>

      {/* Log display */}
      <div
        ref={parentRef}
        className={cn(
          "overflow-auto border rounded-md bg-[#1a1a1a]",
          height
        )}
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '12px',
          lineHeight: '1.4',
        }}
      >
        {filteredLines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {lines.length === 0 ? 'No logs to display' : 'No matches found'}
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const { line } = filteredLines[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  ref={virtualizer.measureElement}
                  data-index={virtualItem.index}
                  className="px-4 py-0.5 text-white hover:bg-white/5"
                >
                  {highlightLine(line)}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
