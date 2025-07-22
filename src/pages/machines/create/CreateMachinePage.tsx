import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { CloudProviderSelector } from "./CloudProviderSelector.tsx"
import { AwsMachineConfigForm } from "./AwsMachineConfigForm.tsx"
import { HetznerMachineConfigForm } from "./HetznerMachineConfigForm.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { useUnboxedQueryClient } from "@/api/api.ts";

export function CreateMachinePage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const cloudProviders = client.useQuery('get', "/v1/workspaces/{workspaceId}/cloud-providers", {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const getCloudProvider = (id: number) => {
    return cloudProviders.data?.items?.find(x => x.id == id)
  }

  return (
    <BaseCreatePage<components["schemas"]["CreateMachine"]>
      title="Create Machine"
      apiRoute="/v1/workspaces/{workspaceId}/machines"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
    >
      {(form) => {
        const cloudProviderId = form.watch("cloud_provider")
        const cloudProvider = cloudProviderId ? getCloudProvider(cloudProviderId) : undefined
        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter machine name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <CloudProviderSelector form={form} />
          
          {cloudProvider?.type === "aws" && (
            <AwsMachineConfigForm form={form} />
          )}
          
          {cloudProvider?.type === "hetzner" && (
            <HetznerMachineConfigForm form={form} />
          )}
        </div>
      }}
    </BaseCreatePage>
  )
} 