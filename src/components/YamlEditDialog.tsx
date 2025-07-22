import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface YamlEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialValue?: string
  onSave: (value: string) => void
  placeholder?: string
}

export function YamlEditDialog({ 
  open, 
  onOpenChange,
  title,
  initialValue = "",
  onSave,
  placeholder
}: YamlEditDialogProps) {
  const [yamlContent, setYamlContent] = useState(initialValue)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setYamlContent(initialValue)
      setValidationError(null)
    }
  }, [open, initialValue])

  const validateYaml = (content: string): string | null => {
    if (!content.trim()) return null
    
    try {
      // Basic YAML validation - check for common syntax issues
      const lines = content.split('\n')
      let indentStack: number[] = []
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.trim() === '' || line.trim().startsWith('#')) continue
        
        const leadingSpaces = line.length - line.trimStart().length
        
        // Check for tabs (not allowed in YAML)
        if (line.includes('\t')) {
          return `Line ${i + 1}: Tabs are not allowed in YAML. Use spaces for indentation.`
        }
        
        // Basic indentation check
        if (leadingSpaces % 2 !== 0) {
          return `Line ${i + 1}: YAML indentation should use even number of spaces (2, 4, 6, etc.)`
        }
      }
      
      return null
    } catch (error) {
      return `Invalid YAML syntax: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const handleContentChange = (value: string) => {
    setYamlContent(value)
    setValidationError(validateYaml(value))
  }

  const handleSave = () => {
    const error = validateYaml(yamlContent)
    if (error) {
      setValidationError(error)
      return
    }
    
    onSave(yamlContent)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setYamlContent(initialValue)
      setValidationError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          <div className="space-y-2">
            <Label htmlFor="yaml-editor">YAML Content</Label>
            <Textarea
              id="yaml-editor"
              value={yamlContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder || "Enter YAML content..."}
              className="min-h-[400px] font-mono text-sm resize-none flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const start = e.currentTarget.selectionStart
                  const end = e.currentTarget.selectionEnd
                  const newValue = yamlContent.substring(0, start) + '  ' + yamlContent.substring(end)
                  handleContentChange(newValue)
                  // Set cursor position after the inserted spaces
                  setTimeout(() => {
                    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
                  }, 0)
                }
              }}
            />
          </div>
          
          {validationError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!!validationError}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 