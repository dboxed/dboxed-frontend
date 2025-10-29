import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useEffect, useState } from "react";
import type { components } from "@/api/models/schema";
import { cn } from "@/lib/utils.ts";

export interface DockerContainer {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  Names: string
  Networks: string
  State: string
  Status: string
  Ports?: string
  RunningFor?: string
}

export async function decompressDockerPs(compressedData: string): Promise<DockerContainer[]> {
  try {
    // Decode base64
    const binaryString = atob(compressedData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Decompress using DecompressionStream
    const stream = new Response(bytes).body
    if (!stream) {
      return []
    }

    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
    const decompressedResponse = new Response(decompressedStream)
    const decompressedText = await decompressedResponse.text()

    // Parse JSON lines
    const lines = decompressedText.trim().split('\n')
    const containers: DockerContainer[] = []

    for (const line of lines) {
      if (line.trim()) {
        try {
          containers.push(JSON.parse(line))
        } catch (e) {
          console.error('Failed to parse container line:', e)
        }
      }
    }

    return containers
  } catch (error) {
    console.error('Failed to decompress docker ps data:', error)
    return []
  }
}

export function ContainerStatusCell({ box }: { box: components["schemas"]["Box"] }) {
  const [containers, setContainers] = useState<DockerContainer[]>([])

  useEffect(() => {
    if (box.sandboxStatus?.dockerPs) {
      decompressDockerPs(box.sandboxStatus.dockerPs).then(setContainers)
    } else {
      setContainers([])
    }
  }, [box.sandboxStatus?.dockerPs])

  if (!box.sandboxStatus?.dockerPs) {
    return <span className="text-sm text-muted-foreground">N/A</span>
  }

  const runningCount = containers.filter(c => c.State.toLowerCase() === 'running').length
  const totalCount = containers.length
  const allOk = runningCount === totalCount && totalCount > 0

  let containersColorClass = ""
  if (box.sandboxStatus?.runStatus === "running") {
    if (allOk) {
      containersColorClass = 'bg-green-400'
    } else if (totalCount === 0) {
      containersColorClass = 'bg-red-500'
    } else {
      containersColorClass = 'bg-yellow-400'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant={"secondary"} className={cn("cursor-help", containersColorClass)}>
              {runningCount}/{totalCount}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          {containers.length > 0 ? (
            <div className="space-y-1">
              {containers.map((container) => (
                <div key={container.ID} className="text-xs">
                  <span className="font-semibold">{container.Names}</span>:{' '}
                  <span className={container.State.toLowerCase() === 'running' ? 'text-green-400' : 'text-yellow-400'}>
                    {container.State}
                  </span>
                  {' '}- {container.Status}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs">No containers</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
