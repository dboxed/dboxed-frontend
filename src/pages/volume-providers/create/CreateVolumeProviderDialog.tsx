import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { RusticConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { buildEndpoint, type ProviderType } from "@/pages/volume-providers/S3StorageForm.tsx"

interface CreateVolumeProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CreateVolumeProviderFormData = components["schemas"]["CreateVolumeProvider"] & {
  rustic: components["schemas"]["CreateVolumeProvider"]["rustic"] & {
    storageS3: components["schemas"]["CreateVolumeProvider"]["rustic"]["storageS3"] & {
      providerType: ProviderType
      region: string
    }
  }
}

export function CreateVolumeProviderDialog({ open, onOpenChange }: CreateVolumeProviderDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const handleSubmit = (data: CreateVolumeProviderFormData): components["schemas"]["CreateVolumeProvider"] => {
    const { providerType, region, ...s3Data } = data.rustic.storageS3

    // Build endpoint from provider type and region
    const endpoint = providerType === "generic"
      ? s3Data.endpoint
      : buildEndpoint(providerType, region)

    return {
      ...data,
      rustic: {
        ...data.rustic,
        storageS3: {
          ...s3Data,
          endpoint,
        },
      },
    }
  }

  return (
    <BaseCreateDialog<CreateVolumeProviderFormData, components["schemas"]["CreateVolumeProvider"], components["schemas"]["VolumeProvider"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Volume Provider"
      apiRoute="/v1/workspaces/{workspaceId}/volume-providers"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      onSubmit={handleSubmit}
      defaultValues={{
        name: "",
        type: "",
        rustic: {
          password: "",
          storageType: "s3",
          storageS3: {
            providerType: "generic",
            accessKeyId: "",
            bucket: "",
            endpoint: "",
            prefix: "",
            secretAccessKey: "",
            region: "",
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
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Provider Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a volume provider type"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="rustic" value="rustic">Rustic</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          {form.watch("type") === "rustic" && (
            <RusticConfigForm form={form}/>
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}