import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SimpleSelectDialogProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fieldLabel: string
  placeholder?: string
  options: T[]
  optionKey: keyof T
  optionLabel: keyof T
  onOk: (selectedItem: T) => void
}

export function SimpleSelectDialog<T>({ 
  open, 
  onOpenChange,
  title,
  fieldLabel,
  placeholder = "Select an option...",
  options,
  optionKey,
  optionLabel,
  onOk
}: SimpleSelectDialogProps<T>) {
  const [selectedValue, setSelectedValue] = useState<string>("")

  const handleOk = () => {
    const selectedItem = options.find(option => String(option[optionKey]) === selectedValue)
    if (selectedItem) {
      onOk(selectedItem)
    }
    onOpenChange(false)
    setSelectedValue("") // Reset for next time
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedValue("") // Reset
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setSelectedValue("") // Reset when opening
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
            <Label htmlFor="select-field">{fieldLabel}</Label>
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={String(option[optionKey])}
                    value={String(option[optionKey])}
                  >
                    {String(option[optionLabel])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleOk} disabled={!selectedValue}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}