import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { VolumeProviderSelector } from "@/pages/volumes/create/index.ts"
import { ResticConfig } from "@/pages/volumes/create/ResticConfig.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { parseSize } from "@/utils/size.ts"
import { useState } from "react"
import type { components } from "@/api/models/dboxed-schema";

interface CreateVolumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateVolumeDialog({ open, onOpenChange }: CreateVolumeDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [selectedProvider, setSelectedProvider] = useState<components["schemas"]["VolumeProvider"] | null>(null)

  function onSubmit(data: components["schemas"]["CreateVolume"]) {
    // Process restic fsSize if it's a string (convert to bytes)
    if (selectedProvider?.type === "restic" && data.restic && typeof data.restic.fsSize === "string") {
      data.restic.fsSize = parseSize(data.restic.fsSize)
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
        volumeProvider: "", // Will be overridden when user selects
        restic: {
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

          {selectedProvider?.type === "restic" && (
            <ResticConfig form={form} />
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}