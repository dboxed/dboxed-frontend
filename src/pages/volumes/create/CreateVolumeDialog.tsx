import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { VolumeProviderSelector } from "@/pages/volumes/create/index.ts"
import { RusticConfig } from "@/pages/volumes/create/RusticConfig.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { parseSize } from "@/utils/size.ts"
import { useState } from "react"
import type { components } from "@/api/models/schema";


interface CreateVolumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateVolumeDialog({ open, onOpenChange }: CreateVolumeDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [selectedProvider, setSelectedProvider] = useState<components["schemas"]["VolumeProvider"] | null>(null)

  function onSubmit(data: components["schemas"]["CreateVolume"]) {
    // Process rustic fsSize if it's a string (convert to bytes)
    if (selectedProvider?.type === "rustic" && data.rustic && typeof data.rustic.fsSize === "string") {
      data.rustic.fsSize = parseSize(data.rustic.fsSize)
    }

    return data
  }

  return (
    <BaseCreateDialog<components["schemas"]["CreateVolume"]>
      open={open}
      onOpenChange={onOpenChange}
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
        volumeProvider: 1, // Will be overridden when user selects
        rustic: {
          fsSize: 1024 * 1024 * 1024, // 1G
          fsType: "ext4",
        }
      }}
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
                  <Input placeholder="Enter volume name" autoCapitalize={"off"} {...field} />
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
    </BaseCreateDialog>
  )
}