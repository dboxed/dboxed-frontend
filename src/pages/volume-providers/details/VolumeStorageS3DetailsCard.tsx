import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import type { components } from "@/api/models/schema"

interface S3FormData {
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  endpoint: string
  prefix: string
  region: string
}

interface S3EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storageS3: components["schemas"]["VolumeStorageS3"]
  save: (update: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

function S3EditDialog({ open, onOpenChange, storageS3, save }: S3EditDialogProps) {
  const buildInitial = (): S3FormData => ({
    accessKeyId: "",
    secretAccessKey: "",
    bucket: storageS3.bucket,
    endpoint: storageS3.endpoint,
    prefix: storageS3.prefix,
    region: storageS3.region || "",
  })

  const handleSave = async (data: S3FormData) => {
    const updateData: components["schemas"]["UpdateVolumeProvider"] = {
      rustic: {
        storageS3: {
          accessKeyId: data.accessKeyId || undefined,
          secretAccessKey: data.secretAccessKey || undefined,
          bucket: data.bucket || undefined,
          endpoint: data.endpoint || undefined,
          prefix: data.prefix || undefined,
          region: data.region || undefined,
        },
      },
    }

    const success = await save(updateData)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <SimpleFormDialog<S3FormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Edit S3 Storage Configuration"
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText="Save Changes"
    >
      {(form) => (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="accessKeyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter new access key ID (leave blank to keep current)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secretAccessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Access Key</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter new secret access key (leave blank to keep current)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bucket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>S3 Bucket</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter bucket name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>S3 Endpoint</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter S3 endpoint"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>S3 Prefix</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter S3 prefix"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>S3 Region</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter S3 region (optional)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </SimpleFormDialog>
  )
}

interface VolumeStorageS3DetailsCardProps {
  storageS3: components["schemas"]["VolumeStorageS3"]
  save: (update: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

export function VolumeStorageS3DetailsCard({ storageS3, save }: VolumeStorageS3DetailsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>S3 Storage Configuration</CardTitle>
            <CardDescription>
              S3 storage backend configuration for the rustic volume provider.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">S3 Bucket</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {storageS3.bucket}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">S3 Endpoint</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {storageS3.endpoint}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">S3 Prefix</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {storageS3.prefix}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">S3 Region</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {storageS3.region || 'Not specified'}
          </p>
        </div>
      </CardContent>

      <S3EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        storageS3={storageS3}
        save={save}
      />
    </Card>
  )
}