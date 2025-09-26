import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { BoxSelector } from "./BoxSelector.tsx"

interface CreateTokenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTokenDialog({ open, onOpenChange }: CreateTokenDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateToken"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Token"
      apiRoute="/v1/workspaces/{workspaceId}/tokens"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        forWorkspace: true
      }}
    >
      {(form) => {
        const forWorkspace = form.watch("forWorkspace")

        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter token name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forWorkspace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Scope</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const isWorkspace = value === "true"
                    field.onChange(isWorkspace)
                    if (isWorkspace) {
                      form.setValue("boxId", undefined)
                    }
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Workspace Token</SelectItem>
                    <SelectItem value="false">Box Token</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Workspace tokens have access to all resources, box tokens are scoped to a specific box
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!forWorkspace && (
            <BoxSelector form={form} />
          )}
        </div>
      }}
    </BaseCreateDialog>
  )
}