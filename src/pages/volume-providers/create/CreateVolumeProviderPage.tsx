import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { VolumeProviderTypeSelector, DboxedConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["dboxed"]).refine((val) => val !== undefined, {
    message: "Please select a volume provider type.",
  }),
  dboxed: z.object({
    api_url: z.string().min(1, "API URL is required"),
    repository_id: z.number().min(1, "Repository ID is required"),
    token: z.string().min(1, "Token is required"),
  }).optional(),
}).refine((data) => {
  if (data.type === "dboxed" && !data.dboxed) {
    return false
  }
  return true
}, {
  message: "Please configure the selected volume provider type.",
  path: ["type"]
})

export function CreateVolumeProviderPage() {
  const { workspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData: components["schemas"]["CreateVolumeProvider"] = {
      name: data.name,
      type: data.type,
    }

    if (data.type === "dboxed" && data.dboxed) {
      submitData.dboxed = {
        api_url: data.dboxed.api_url,
        repository_id: data.dboxed.repository_id,
        token: data.dboxed.token,
      }
    }

    return submitData
  }

  return (
    <BaseCreatePage
      title="Create Volume Provider"
      apiRoute="/v1/workspaces/{workspaceId}/volume-providers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      onSubmit={onSubmit}
      defaultValues={{
        name: "",
        type: undefined,
        dboxed: {
          api_url: "",
          repository_id: 0,
          token: "",
        }
      }}
      resolver={zodResolver(FormSchema)}
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
                  <Input placeholder="Enter volume provider name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <VolumeProviderTypeSelector form={form} />
          
          {form.watch("type") === "dboxed" && (
            <DboxedConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreatePage>
  )
}