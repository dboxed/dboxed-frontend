import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Editor } from "@monaco-editor/react"
import { Edit } from "lucide-react"
import { useState } from "react"
import type { ComposeProjectInfo } from "@/pages/boxes/details/compose-projects/project-info.ts";

interface ComposeProjectEditorDialogProps {
  project: ComposeProjectInfo
  onUpdateProject: (newContent: string) => void
}

export function ComposeProjectEditorDialog({ project, onUpdateProject }: ComposeProjectEditorDialogProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(project.content)
  const [hasChanges, setHasChanges] = useState(false)

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      setHasChanges(value !== project.content)
    }
  }

  const handleSave = () => {
    onUpdateProject(content)
    setHasChanges(false)
    setOpen(false)
  }

  const handleCancel = () => {
    setContent(project.content)
    setHasChanges(false)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasChanges) {
      // Don't allow closing if there are unsaved changes
      return
    }
    if (newOpen) {
      setContent(project.content)
      setHasChanges(false)
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] min-w-[80vw] max-h-[90vh] min-h-[70vh] flex flex-col h-full">
        <DialogHeader>
          <DialogTitle>Edit Compose Project</DialogTitle>
          <DialogDescription>
            Editing "{project.name}" - Docker Compose YAML configuration
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 border rounded-md m-4 mt-0">
                <Editor
                  language="yaml"
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
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}