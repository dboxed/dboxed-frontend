import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Editor } from "@monaco-editor/react";

interface EditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialValue?: string
  onSave: (value: string) => void
  language?: string
}

export function EditorDialog({
  open, 
  onOpenChange,
  title,
  initialValue = "",
  onSave,
  language,
}: EditorDialogProps) {
  const [yamlContent, setYamlContent] = useState(initialValue)

  useEffect(() => {
    if (open) {
      setYamlContent(initialValue)
    }
  }, [open, initialValue])

  const handleChange = (newValue: string | undefined) => {
    setYamlContent(newValue || "")
  }

  const handleSave = () => {
    onSave(yamlContent)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-4xl min-h-[40vh] max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Editor
          height="100vh"
          language={language}
          theme="vs-dark"
          value={yamlContent}
          onChange={handleChange}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 