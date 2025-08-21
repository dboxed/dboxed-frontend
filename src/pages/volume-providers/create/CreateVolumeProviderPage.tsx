import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { VolumeProviderTypeSelector, ResticConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["restic"]).refine((val) => val !== undefined, {
    message: "Please select a volume provider type.",
  }),
  restic: z.object({
    repository: z.string().min(1, "Repository is required"),
    s3_access_key_id: z.string().nullable().optional(),
    s3_secret_access_key: z.string().nullable().optional(),
    ssh_key: z.string().nullable().optional(),
  }).optional(),
}).refine((data) => {
  if (data.type === "restic" && !data.restic) {
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

    if (data.type === "restic" && data.restic) {
      submitData.restic = {
        repository: data.restic.repository,
        s3_access_key_id: data.restic.s3_access_key_id || null,
        s3_secret_access_key: data.restic.s3_secret_access_key || null,
        ssh_key: data.restic.ssh_key || null,
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
        restic: {
          repository: "",
          s3_access_key_id: "",
          s3_secret_access_key: "",
          ssh_key: "",
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
          
          {form.watch("type") === "restic" && (
            <ResticConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreatePage>
  )
}