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
