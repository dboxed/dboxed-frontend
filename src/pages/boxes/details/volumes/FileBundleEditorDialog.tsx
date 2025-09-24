import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { MemfsEditor } from "./MemfsEditor.tsx"
import { FileContentEditor } from "./FileContentEditor.tsx"
import { buildFileBundleEntriesFromMemfs, buildMemfsFromBundleEntries } from "./memory-fs-utils.ts"
import type { components } from "@/api/models/schema"
import { FolderTree } from "lucide-react"
import { useMemo, useState } from "react"

interface FileBundleEditorProps {
  volume: components["schemas"]["BoxVolumeSpec"]
  saveFileBundle: (newVolume: components["schemas"]["BoxVolumeSpec"]) => Promise<boolean>
}

export function FileBundleEditorDialog({ volume, saveFileBundle }: FileBundleEditorProps) {
  const [open, setOpen] = useState(false)
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null)
  const fileBundle = volume?.fileBundle
  
  const files = useMemo(() => fileBundle?.files || [], [fileBundle?.files])
  const [cancelCounter, setCancelCounter] = useState(0)
  
  const fs = useMemo(() => {
    if (cancelCounter) {
      // shut up linter
    }
    return buildMemfsFromBundleEntries(files)
  }, [files, cancelCounter])

  const handleSave = async () => {
    const updatedFiles = buildFileBundleEntriesFromMemfs(fs)
    const newVolume = {
      ...volume,
      fileBundle: {
        ...volume.fileBundle,
        files: updatedFiles
      }
    }
    if (await saveFileBundle(newVolume)) {
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setCancelCounter(n => n + 1)
    setSelectedFilePath(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing via Save/Cancel buttons, not by clicking outside or escape
      if (!newOpen) return
      setOpen(newOpen)
    }}>
      <DialogTrigger asChild>
        <Button
          type={"button"}
          variant="outline"
          size="sm"
        >
          <FolderTree className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] min-w-[80vw] max-h-[95vh] min-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>File Bundle Editor</DialogTitle>
          <DialogDescription>
            Editing files in bundle "{volume.name}" ({files.length} files)
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left side - File tree */}
          <div className="w-1/2 border-r pr-4 flex flex-col min-h-0">
            <MemfsEditor
              volume={fs}
              className="flex-1 min-h-0"
              onFileSelect={(path) => setSelectedFilePath(path)}
            />
          </div>
          
          {/* Right side - File content editor */}
          <div className="w-1/2 pl-4 flex flex-col min-h-0">
            {selectedFilePath && selectedFilePath !== "/" && fs.exists(selectedFilePath) ? (
              <FileContentEditor
                fs={fs}
                path={selectedFilePath}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a file to edit
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}