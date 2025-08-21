/**
 * Parse a human-readable size string and return the number of bytes
 * @param sizeString - A string like "1.5GB", "512MB", "2TB", "1024", etc.
 * @returns The size in bytes
 */
export function parseSize(sizeString: string): number {
  const trimmed = sizeString.trim().toUpperCase()
  
  // If it's just a number, assume bytes
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return parseFloat(trimmed)
  }
  
  // Match number followed by optional unit
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([KMGTPE]?B?)$/)
  if (!match) {
    throw new Error(`Invalid size format: ${sizeString}`)
  }
  
  const value = parseFloat(match[1])
  const unit = match[2] || 'B'
  
  const multipliers: Record<string, number> = {
    'B': 1,
    'K': 1024,
    'KB': 1024,
    'M': 1024 * 1024,
    'MB': 1024 * 1024,
    'G': 1024 * 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'T': 1024 * 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
    'P': 1024 * 1024 * 1024 * 1024 * 1024,
    'PB': 1024 * 1024 * 1024 * 1024 * 1024,
    'E': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
    'EB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  }
  
  const multiplier = multipliers[unit]
  if (!multiplier) {
    throw new Error(`Unsupported unit: ${unit}`)
  }
  
  return Math.floor(value * multiplier)
}

/**
 * Format bytes as human-readable size string
 * @param bytes - Number of bytes
 * @returns Human-readable size string like "1.5 GB"
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`
}