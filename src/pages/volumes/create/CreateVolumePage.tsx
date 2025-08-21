import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { VolumeProviderSelector } from "@/pages/volumes/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { parseSize } from "@/utils/size.ts"
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  size: z.string().min(1, "Size is required").refine((val) => {
    try {
      const bytes = parseSize(val)
      return bytes > 0
    } catch {
      return false
    }
  }, {
    message: "Invalid size format. Use formats like '1GB', '512MB', '2.5TB'",
  }),
  volume_provider: z.preprocess((val) => {
    if (typeof val === 'string') return parseInt(val)
    return val
  }, z.number().min(1, "Please select a volume provider.")),
  restic: z.object({}).optional(),
})

export function CreateVolumePage() {
  const { workspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Parse the human-readable size to bytes
    const sizeInBytes = parseSize(data.size)

    const submitData: components["schemas"]["CreateVolume"] = {
      name: data.name,
      size: sizeInBytes,
      volume_provider: data.volume_provider,
      restic: data.restic || {},
    }

    return submitData
  }

  return (
    <BaseCreatePage
      title="Create Volume"
      apiRoute="/v1/workspaces/{workspaceId}/volumes"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      onSubmit={onSubmit}
      defaultValues={{
        name: "",
        size: "1GB",
        volume_provider: 1, // Will be overridden when user selects
        restic: {},
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
                  <Input placeholder="Enter volume name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter size (e.g., '1GB', '512MB', '2.5TB')" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <VolumeProviderSelector form={form} />
        </div>
      )}
    </BaseCreatePage>
  )
}