import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { NetbirdConfigForm, NetworkTypeSelector } from "@/pages/networks/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";


interface CreateNetworkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNetworkDialog({ open, onOpenChange }: CreateNetworkDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateNetwork"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Network"
      apiRoute="/v1/workspaces/{workspaceId}/networks"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        name: "",
        type: "netbird",
        netbird: {
          netbirdVersion: "latest",
          apiUrl: "",
          apiAccessToken: "",
        },
      }}
    >
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter network name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <NetworkTypeSelector form={form} />

          {form.watch("type") === "netbird" && (
            <NetbirdConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}