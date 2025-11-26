import { useCallback } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Settings } from "lucide-react"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"

interface FileModeDialogProps {
  uid: number
  gid: number
  mode: string
  onUpdate: (uid: number, gid: number, mode: string) => Promise<boolean>
}

interface FormData {
  uid: string
  gid: string
  mode: string
}

export function FileModeDialog({ uid, gid, mode, onUpdate }: FileModeDialogProps) {
  const buildInitialFormData = useCallback((): FormData => {
    return {
      uid: uid.toString(),
      gid: gid.toString(),
      mode: mode
    }
  }, [uid, gid, mode])

  const handleSave = async (formData: FormData) => {
    return onUpdate(parseInt(formData.uid), parseInt(formData.gid), formData.mode)
  }

  return (
    <>
      <SimpleFormDialog<FormData>
        trigger={
          <Button
            type={"button"}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        }
        title="Edit permissions and ownership"
        buildInitial={buildInitialFormData}
        onSave={handleSave}
        saveText="Save Changes"
      >
        {(form) => (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Mode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0700"
                      pattern="[0-7]{3,4}"
                      title="Enter octal file permissions (e.g., 0755, 0644)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </SimpleFormDialog>
    </>
  )
}