import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { ResticConfigForm } from "@/pages/volume-providers/create/index.ts"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"

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
        type: "restic",
        restic: {
          password: "",
          storageType: "s3",
          storagePrefix: "",
          s3BucketId: null,
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
                  <Input placeholder="Enter volume provider name" autoCapitalize={"off"} {...field} />
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
                      <SelectItem key="restic" value="restic">Restic</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          {form.watch("type") === "restic" && (
            <ResticConfigForm form={form}/>
          )}
        </div>
      )}
    </BaseCreateDialog>
  )
}