import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { type UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface FileContentEditorProps {
  form: UseFormReturn<components["schemas"]["UpdateBox"]>
  bundleIndex: number
  fileIndex: number
}

export function FileContentEditor({ form, bundleIndex, fileIndex }: FileContentEditorProps) {
  const fileBundles = form.watch("boxSpec.fileBundles") || []
  const bundle = fileBundles[bundleIndex]
  const file = bundle?.files?.[fileIndex]

  const [content, setContent] = useState<string>("")
  const [filePath, setFilePath] = useState<string>("")
  const [uid, setUid] = useState<string>("")
  const [gid, setGid] = useState<string>("")
  const [mode, setMode] = useState<string>("")

  useEffect(() => {
    if (file) {
      // Decode base64 content if it exists, otherwise use string data
      if (file.data) {
        try {
          setContent(atob(file.data))
        } catch (error) {
          console.error("Failed to decode base64 data:", error)
          setContent(file.data)
        }
      } else {
        setContent(file.stringData || "")
      }
      
      // Set file properties
      setFilePath(file.path || "")
      setUid(file.uid?.toString() || "")
      setGid(file.gid?.toString() || "")
      setMode(file.mode || "")
    }
  }, [file])

  if (!file) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          File not found
        </CardContent>
      </Card>
    )
  }

  const updateFileProperty = (property: string, value: string | number) => {
    const updatedBundles = [...fileBundles]
    const updatedFiles = [...(updatedBundles[bundleIndex].files || [])]
    
    updatedFiles[fileIndex] = {
      ...updatedFiles[fileIndex],
      [property]: value
    }
    
    updatedBundles[bundleIndex] = {
      ...updatedBundles[bundleIndex],
      files: updatedFiles
    }
    
    form.setValue("boxSpec.fileBundles", updatedBundles)
  }

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      updateFileProperty("stringData", value)
    }
  }

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilePath(value)
    updateFileProperty("path", value)
  }

  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUid(value)
    updateFileProperty("uid", value ? parseInt(value, 10) : 0)
  }

  const handleGidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGid(value)
    updateFileProperty("gid", value ? parseInt(value, 10) : 0)
  }

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMode(value)
    updateFileProperty("mode", value)
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
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* File Properties Form */}
        <div className="grid grid-cols-1 gap-4">
          {/* Path field - full width */}
          <div className="space-y-2">
            <Label htmlFor="file-path">Path</Label>
            <Input
              id="file-path"
              value={filePath}
              onChange={handlePathChange}
              placeholder="/path/to/file"
            />
          </div>
          
          {/* Other properties - three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-uid">UID</Label>
              <Input
                id="file-uid"
                type="number"
                value={uid}
                onChange={handleUidChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-gid">GID</Label>
              <Input
                id="file-gid"
                type="number"
                value={gid}
                onChange={handleGidChange}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-mode">Mode</Label>
              <Input
                id="file-mode"
                value={mode}
                onChange={handleModeChange}
                placeholder="0644"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* File Content Editor */}
        <div className="flex-1 min-h-0">
          <div className="h-full border rounded-md">
            <Editor
              language={getLanguage(filePath)}
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}