import { MemoryFileSystem } from "@/utils/memory-fs.ts"
import type { components } from "@/api/models/schema"

export const textModeMarker = 0o1000

const convertBase64ToUint8Array = (text: string)=> {
  const binaryString = atob(text)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export function buildMemfsFromBundleEntries(entries: components["schemas"]["FileBundleEntry"][]): MemoryFileSystem {
  const fs = new MemoryFileSystem()

  const ensureParentDirs = (filePath: string) => {
    const pathParts = filePath.split('/').filter(part => part.length > 0)
    let currentPath = ''
    
    // Create parent directories if they don't exist
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i]
      
      if (!fs.exists(currentPath)) {
        fs.mkdir(currentPath, { mode: 0o755, recursive: true })
      } else {
        const stat = fs.stat(currentPath)
        if (stat && stat.type !== 'dir') {
          throw new Error(`Path ${currentPath} exists but is not a directory`)
        }
      }
    }
  }

  // Sort entries to ensure directories are created before files
  const sortedEntries = entries.slice().sort((a, b) => {
    // Directories first, then files, then symlinks
    const typeOrder = { 'dir': 0, 'file': 1, 'symlink': 2 }
    const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 3
    const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 3
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    
    // Then by path depth (shorter paths first)
    const aDepth = a.path?.split('/').filter(p => p.length > 0).length ?? 0
    const bDepth = b.path?.split('/').filter(p => p.length > 0).length ?? 0
    return aDepth - bDepth
  })

  for (const entry of sortedEntries) {
    if (!entry.path) continue

    const fullPath = entry.path.startsWith('/') ? entry.path : '/' + entry.path
    const mode = parseInt(entry.mode || '0644', 8) & 0o777

    try {
      switch (entry.type) {
        case 'file': case '': case undefined: {
          ensureParentDirs(fullPath)
          let content: Uint8Array | string
          let fileMode = mode
          if (entry.stringData !== undefined) {
            content = entry.stringData
            fileMode |= textModeMarker
          } else if (entry.data !== undefined) {
            content = convertBase64ToUint8Array(entry.data)
          } else {
            content = new Uint8Array(0)
          }
          fs.writeFile(fullPath, content, { 
            uid: entry.uid || 0, 
            gid: entry.gid || 0, 
            mode: fileMode 
          })
          break
        }
        
        case 'dir': {
          ensureParentDirs(fullPath)
          if (!fs.exists(fullPath)) {
            fs.mkdir(fullPath, { 
              uid: entry.uid || 0, 
              gid: entry.gid || 0, 
              mode: mode 
            })
          } else {
            fs.chown(fullPath, entry.uid || 0, entry.gid || 0)
            fs.chmod(fullPath, mode)
          }
          break
        }
        
        case 'symlink': {
          ensureParentDirs(fullPath)
          const target = entry.stringData || atob(entry.data || '')
          if (target) {
            fs.symlink(target, fullPath, {
              uid: entry.uid || 0,
              gid: entry.gid || 0,
              mode: mode
            })
          }
          break
        }
      }
    } catch (error) {
      console.warn(`Failed to create ${entry.type} at ${fullPath}:`, error)
    }
  }

  return fs
}

export const buildFileBundleEntriesFromMemfs = (fs: MemoryFileSystem): components["schemas"]["FileBundleEntry"][] => {
  const entries: components["schemas"]["FileBundleEntry"][] = []

  const traverseDirectory = (dirPath: string) => {
    const dirEntries = fs.readdir(dirPath)
    if (!dirEntries) return

    for (const dirEntry of dirEntries) {
      let itemPath = dirPath
      if (!itemPath.endsWith("/")) {
        itemPath += "/"
      }
      itemPath += dirEntry.name

      const stat = dirEntry.stats
      const mode = stat.mode & 0o777

      const entry: components["schemas"]["FileBundleEntry"] = {
        path: itemPath,
        uid: stat.uid,
        gid: stat.gid,
        mode: mode.toString(8).padStart(3, '0'),
      }

      if (stat.type === 'dir') {
        entry.type = "dir"
      } else if (stat.type === 'symlink') {
        entry.type = "symlink"
        const target = fs.readlink(itemPath)
        if (target) entry.stringData = target
      } else if (stat.type === 'file') {
        entry.type = "file"
        const data = fs.readFile(itemPath)
        if (data) {
          if (stat.mode & textModeMarker) {
            entry.stringData = typeof data === 'string' ? data : new TextDecoder().decode(data)
          } else {
            const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
            entry.data = btoa(String.fromCharCode(...bytes))
          }
        }
      } else {
        console.error(`Unknown file type ${itemPath}`)
      }

      entries.push(entry)

      if (stat.type === 'dir') {
        traverseDirectory(itemPath)
      }
    }
  }
  traverseDirectory('/')
  return entries
}