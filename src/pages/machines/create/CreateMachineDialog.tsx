import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { MachineProviderSelector } from "./MachineProviderSelector.tsx"
import { AwsMachineConfigForm } from "./AwsMachineConfigForm.tsx"
import { HetznerMachineConfigForm } from "./HetznerMachineConfigForm.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts";
import type { ReactNode } from "react";

interface CreateMachineDialogProps {
  trigger: ReactNode
}

export function CreateMachineDialog({ trigger }: CreateMachineDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const machineProviders = client.useQuery('get', "/v1/workspaces/{workspaceId}/machine-providers", {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const getMachineProvider = (id: string) => {
    return machineProviders.data?.items?.find(x => x.id == id)
  }

  const handleSubmit = (data: components["schemas"]["CreateMachine"]) => {
    const mp = getMachineProvider(data.machineProvider)
    if (!mp) {
      return data
    }

    if (mp.type == 'aws') {
      data.hetzner = undefined
    } else if (mp.type == 'hetzner') {
      data.aws = undefined
    }
    return data
  }

  return (
    <BaseCreateDialog<components["schemas"]["CreateMachine"]>
      trigger={trigger}
      title="Create Machine"
      apiRoute="/v1/workspaces/{workspaceId}/machines"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        aws: {
          instanceType: "t3.micro",
          rootVolumeSize: 20,
          subnetId: "",
        },
        hetzner: {
          serverLocation: "fsn1",
          serverType: "cpx11"
        }
      }}
      onSubmit={handleSubmit}
    >
      {(form) => {
        const machineProviderId = form.watch("machineProvider")
        const machineProvider = machineProviderId ? getMachineProvider(machineProviderId) : undefined
        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter machine name" autoCapitalize={"off"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <MachineProviderSelector form={form} />

          {machineProvider?.type === "aws" && (
            <AwsMachineConfigForm form={form} />
          )}

          {machineProvider?.type === "hetzner" && (
            <HetznerMachineConfigForm form={form} />
          )}
        </div>
      }}
    </BaseCreateDialog>
  )
}