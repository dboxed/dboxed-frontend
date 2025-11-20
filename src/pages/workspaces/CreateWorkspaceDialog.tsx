import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BaseCreateDialog } from "@/components/BaseCreateDialog"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/dboxed-schema"

interface CreateWorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const { setWorkspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateWorkspace"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Workspace"
      apiRoute="/v1/workspaces"
      onSuccess={(data) => {
        setWorkspaceId(data.id)
      }}
      defaultValues={{
        name: "",
      }}
    >
      {(form) => (
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Please enter the name" autoCapitalize={"off"} {...field} />
              </FormControl>
              <FormDescription>
                This is the name of the workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </BaseCreateDialog>
  )
}