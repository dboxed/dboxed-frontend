import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { FileModeDialog } from "./FileModeDialog.tsx"
import { MemoryFileSystem, type FileStats } from "@/utils/memory-fs.ts"
import { textModeMarker } from "@/pages/boxes/details/volumes/memory-fs-utils.ts"

interface FileContentEditorProps {
  fs: MemoryFileSystem
  path: string
}

export function FileContentEditor({ fs, path }: FileContentEditorProps) {
  const [stat, setStat] = useState<FileStats>()
  const [isText, setIsText] = useState(true)
  const [content, setContent] = useState<string>("")

  const updateStat = useCallback(() => {
    const stat = fs.stat(path)
    setStat(stat || undefined)
    return stat
  }, [fs, path])

  useEffect(() => {
    const stat = updateStat()
    if (!stat) return

    if (stat.type === 'dir') {
      return
    }

    const isText = !!(stat.mode & textModeMarker)
    const data = fs.readFile(path)
    
    if (data) {
      if (isText) {
        setContent(typeof data === 'string' ? data : new TextDecoder().decode(data))
      } else {
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
        setContent(btoa(String.fromCharCode(...bytes)))
      }
    } else {
      setContent("")
    }

    setIsText(isText)
  }, [fs, path, updateStat])

  const handleContentChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setContent(newValue)

      if (isText) {
        fs.writeFile(path, newValue, { mode: stat?.mode })
      } else {
        try {
          const binaryString = atob(newValue)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          fs.writeFile(path, bytes, { mode: stat?.mode })
        } catch (error) {
          console.error('Failed to decode base64:', error)
          return
        }
      }
      updateStat()
    }
  }

  const handleModeUpdate = (uid: number, gid: number, mode: string) => {
    let modeValue = parseInt(mode, 8)
    if (isText) {
      modeValue |= textModeMarker
    }
    fs.chown(path, uid, gid)
    fs.chmod(path, modeValue)
    updateStat()
  }

  // Determine file language for syntax highlighting
  const getLanguage = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'json':
        return 'json'
      case 'yaml':
      case 'yml':
        return 'yaml'
      case 'xml':
        return 'xml'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'md':
        return 'markdown'
      case 'sh':
        return 'shell'
      case 'py':
        return 'python'
      case 'go':
        return 'go'
      case 'rs':
        return 'rust'
      case 'c':
      case 'h':
        return 'c'
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp'
      default:
        return 'plaintext'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">File Properties</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* File Properties Form */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-uid">UID</Label>
              <Input
                id="file-uid"
                type="number"
                value={stat?.uid || "0"}
                readOnly
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-gid">GID</Label>
              <Input
                id="file-gid"
                type="number"
                value={stat?.gid || "0"}
                readOnly
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-mode">Mode</Label>
              <Input
                id="file-mode"
                value={((stat?.mode || 0o644) & 0o777).toString(8).padStart(4, "0")}
                readOnly
                placeholder="0644"
              />
            </div>
            <div className="space-y-2">
              <Label>Modify</Label>
              <FileModeDialog
                uid={stat?.uid || 0}
                gid={stat?.gid || 0}
                mode={((stat?.mode || 0o644) & 0o777).toString(8).padStart(3, "0")}
                onUpdate={handleModeUpdate}
              />
            </div>
          </div>
        </div>

        <Separator/>

        {/* File Content Editor */}
        <div className="flex-1 min-h-0">
          {stat?.type === 'file' && <div className="h-full border rounded-md">
            <Editor
              language={getLanguage(path)}
              value={content}
              onChange={handleContentChange}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on"
              }}
              theme="vs-dark"
            />
          </div>}
        </div>
      </CardContent>
    </Card>
  )
}