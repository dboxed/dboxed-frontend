import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import type { components } from "@/api/models/schema"
import { useEffect } from "react";

type FileBundleEntry = components["schemas"]["FileBundleEntry"]

interface FileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialFile: FileBundleEntry
  onSave: (file: FileBundleEntry) => void
  title?: string
}

export function FileDialog({ 
  open, 
  onOpenChange,
  initialFile,
  onSave,
}: FileDialogProps) {
  const form = useForm<components["schemas"]["FileBundleEntry"]>()

  useEffect(() => {
    form.reset(initialFile)
  }, [initialFile]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  const handleSave = (data: components["schemas"]["FileBundleEntry"]) => {
    const savedFile: FileBundleEntry = {
      ...data,
      stringData: data.stringData
    }
    onSave(savedFile)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`Editing ${initialFile.path}`}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="stringData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter file content..."
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save File
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 