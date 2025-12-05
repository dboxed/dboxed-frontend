/**
 * Formats a time difference as a human-readable relative time string.
 * @param date The date to compare against now
 * @returns A string like "5 minutes ago", "2 hours ago", etc.
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const minutesAgo = (now.getTime() - then.getTime()) / 1000 / 60

  if (minutesAgo < 1) {
    return "less than a minute ago"
  } else if (minutesAgo < 60) {
    const mins = Math.floor(minutesAgo)
    return `${mins} minute${mins !== 1 ? 's' : ''} ago`
  } else if (minutesAgo < 1440) {
    const hours = Math.floor(minutesAgo / 60)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(minutesAgo / 1440)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}

/**
 * Formats a duration in seconds to a human-readable string.
 * @param seconds The duration in seconds
 * @returns A string like "5m 30s", "2h 15m", "1d 3h", etc.
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) {
    return "0s"
  }

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days}d`)
  }
  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`)
  }

  // Show max 2 parts for readability
  return parts.slice(0, 2).join(' ')
}
