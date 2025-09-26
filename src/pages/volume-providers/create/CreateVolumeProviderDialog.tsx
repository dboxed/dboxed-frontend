import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { VolumeProviderTypeSelector, RusticConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";


interface CreateVolumeProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateVolumeProviderDialog({ open, onOpenChange }: CreateVolumeProviderDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateVolumeProvider"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Volume Provider"
      apiRoute="/v1/workspaces/{workspaceId}/volume-providers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        name: "",
        rustic: {
          password: "",
          storageS3: {
            accessKeyId: "",
            bucket: "",
            endpoint: "",
            prefix: "",
            region: null,
            secretAccessKey: "",
          },
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
                  <Input placeholder="Enter volume provider name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <VolumeProviderTypeSelector form={form} />

          {form.watch("type") === "rustic" && (
            <RusticConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}