import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { NetworkSelector } from "./NetworkSelector.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import type { ReactNode } from "react";

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

          <NetworkSelector form={form} />
        </div>
      )}
    </BaseCreateDialog>
  )
}
