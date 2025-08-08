import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SimpleInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fieldLabel: string
  placeholder?: string
  defaultValue?: string
  onOk: (value: string) => void
}

export function SimpleInputDialog({ 
  open, 
  onOpenChange,
  title,
  fieldLabel,
  placeholder,
  defaultValue = "",
  onOk
}: SimpleInputDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue)

  const handleOk = () => {
    onOk(inputValue)
    onOpenChange(false)
    setInputValue(defaultValue) // Reset for next time
  }

  const handleCancel = () => {
    onOpenChange(false)
    setInputValue(defaultValue) // Reset to default
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setInputValue(defaultValue) // Reset when opening
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="input-field">{fieldLabel}</Label>
            <Input
              id="input-field"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOk()
                }
                if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleOk}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 