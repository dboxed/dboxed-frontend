import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { formatTimeAgo } from "@/utils/time.ts";

interface TimeAgoProps {
  date: Date | string
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const formattedDate = dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>
            {formatTimeAgo(date)}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{formattedDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
