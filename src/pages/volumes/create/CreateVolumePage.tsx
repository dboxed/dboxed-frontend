import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreatePage } from "@/pages/base/BaseCreatePage.tsx"
import { VolumeProviderSelector } from "@/pages/volumes/create/index.ts"
import { RusticConfig } from "@/pages/volumes/create/RusticConfig.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { parseSize } from "@/utils/size.ts"
import { useState } from "react"
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  volume_provider: z.preprocess((val) => {
    if (typeof val === 'string') return parseInt(val)
    return val
  }, z.number().min(1, "Please select a volume provider.")),
  rustic: z.object({
    fs_size: z.string().min(1, "Filesystem size is required").refine((val) => {
      try {
        const bytes = parseSize(val)
        return bytes > 0
      } catch {
        return false
      }
    }, {
      message: "Invalid size format. Use formats like '1GB', '512MB', '2.5TB'",
    }),
    fs_type: z.string().min(1, "Filesystem type is required"),
  }).optional(),
}).refine((_data) => {
  // If provider type is rustic, require rustic config
  // Note: We can't directly check provider type here since it's not in form data
  // This validation will be handled by the component logic
  return true
}, {
  message: "Rustic configuration is required for rustic providers.",
})

export function CreateVolumePage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const [selectedProvider, setSelectedProvider] = useState<components["schemas"]["VolumeProvider"] | null>(null)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData: components["schemas"]["CreateVolume"] = {
      name: data.name,
      volume_provider: data.volume_provider,
    }

    // Add rustic configuration if provider type is rustic
    if (selectedProvider?.type === "rustic" && data.rustic) {
      submitData.rustic = {
        fs_size: parseSize(data.rustic.fs_size),
        fs_type: data.rustic.fs_type,
      }
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
        volume_provider: 1, // Will be overridden when user selects
        rustic: {
          fs_size: "",
          fs_type: "ext4",
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
                  <Input placeholder="Enter volume name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <VolumeProviderSelector 
            form={form} 
            onProviderChange={setSelectedProvider}
          />
          
          {selectedProvider?.type === "rustic" && (
            <RusticConfig form={form} />
          )}
        </div>
      )}
    </BaseCreatePage>
  )
}