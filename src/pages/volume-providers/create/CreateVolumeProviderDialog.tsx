import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { VolumeProviderTypeSelector, RusticConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import type { components } from "@/api/models/schema";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  type: z.enum(["rustic"]).refine((val) => val !== undefined, {
    message: "Please select a volume provider type.",
  }),
  rustic: z.object({
    password: z.string().min(1, "Password is required"),
    storageS3: z.object({
      accessKeyId: z.string().min(1, "Access Key ID is required"),
      bucket: z.string().min(1, "Bucket is required"),
      endpoint: z.string().min(1, "Endpoint is required"),
      prefix: z.string().min(1, "Prefix is required"),
      region: z.string().nullable(),
      secretAccessKey: z.string().min(1, "Secret Access Key is required"),
    }),
  }),
}).refine((data) => {
  if (data.type === "rustic" && !data.rustic) {
    return false
  }
  return true
}, {
  message: "Please configure the selected volume provider type.",
  path: ["type"]
})

interface CreateVolumeProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateVolumeProviderDialog({ open, onOpenChange }: CreateVolumeProviderDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const submitData: components["schemas"]["CreateVolumeProvider"] = {
      name: data.name,
      rustic: {
        password: data.rustic.password,
        storageS3: {
          accessKeyId: data.rustic.storageS3.accessKeyId,
          bucket: data.rustic.storageS3.bucket,
          endpoint: data.rustic.storageS3.endpoint,
          prefix: data.rustic.storageS3.prefix,
          region: data.rustic.storageS3.region,
          secretAccessKey: data.rustic.storageS3.secretAccessKey,
        },
      },
    }

    return submitData
  }

  return (
    <BaseCreateDialog
      open={open}
      onOpenChange={onOpenChange}
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

          {form.watch("type") === "rustic" && (
            <RusticConfigForm form={form} />
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}