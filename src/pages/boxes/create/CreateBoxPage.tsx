import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { NetworkSelector } from "./NetworkSelector.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"

export function CreateBoxPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  const handleSubmit = (data: components["schemas"]["CreateBox"]) => {
    return data
  }

  return (
    <BaseCreatePage<components["schemas"]["CreateBox"]>
      title="Create Box"
      apiRoute="/v1/workspaces/{workspaceId}/boxes"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{

      }}
      onSubmit={handleSubmit}
    >
      {(form) => {
        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter box name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <NetworkSelector form={form} />
        </div>
      }}
    </BaseCreatePage>
  )
} 