import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { ResourceSelector } from "@/components/ResourceSelector.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import type { ReactNode } from "react"
import { Network } from "lucide-react"

interface CreateBoxDialogProps {
  trigger: ReactNode
}

export function CreateBoxDialog({ trigger }: CreateBoxDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateBox"]>
      trigger={trigger}
      title="Create Box"
      apiRoute="/v1/workspaces/{workspaceId}/boxes"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{}}
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
                  <Input placeholder="Enter box name" autoCapitalize={"off"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network (Optional)</FormLabel>
                <FormControl>
                  <ResourceSelector<components["schemas"]["Network"]>
                    resourcePath="/v1/workspaces/{workspaceId}/networks"
                    apiParams={{ path: { workspaceId } }}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder="Select a network (optional)"
                    renderItem={(network) => (
                      <div className="flex items-center space-x-2">
                        <Network className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{network.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {network.type} • {network.status}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </BaseCreateDialog>
  )
}
