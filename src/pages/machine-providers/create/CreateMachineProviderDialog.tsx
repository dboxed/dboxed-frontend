import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import {
  AwsConfigForm,
  HetznerConfigForm,
  MachineProviderTypeSelector,
  SshKeyForm
} from "@/pages/machine-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/dboxed-schema";
import { deepClone } from "@/utils/utils.ts";

interface CreateMachineProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateMachineProviderDialog({ open, onOpenChange }: CreateMachineProviderDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const handleSubmit = (data: components["schemas"]["CreateMachineProvider"]) => {
    const c = deepClone(data)
    switch (data.type) {
      case "aws":
        c.hetzner = undefined
        break
      case "hetzner":
        c.aws = undefined
        break
    }
    return c
  }

  return (
    <BaseCreateDialog<components["schemas"]["CreateMachineProvider"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Machine Provider"
      apiRoute="/v1/workspaces/{workspaceId}/machine-providers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        name: "",
        type: "aws",
        sshKeyPublic: "",
      }}
      onSubmit={handleSubmit}
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
                  <Input placeholder="Enter machine provider name" autoCapitalize={"off"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MachineProviderTypeSelector form={form} />
          <SshKeyForm form={form} />

          {form.watch("type") === "aws" && (
            <AwsConfigForm form={form} />
          )}

          {form.watch("type") === "hetzner" && (
            <HetznerConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}