import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { DetailsCardLayout } from "@/components/DetailsCardLayout.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import type { components } from "@/api/models/schema"
import {
  S3StorageForm,
  detectProviderType,
  extractRegionFromEndpoint,
  buildEndpoint,
  type ProviderType
} from "@/pages/volume-providers/S3StorageForm.tsx"

interface S3FormData {
  providerType: ProviderType
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
  const buildInitial = (): S3FormData => {
    const providerType = detectProviderType(storageS3.endpoint)
    const extractedRegion = extractRegionFromEndpoint(storageS3.endpoint, providerType)

    return {
      providerType,
      accessKeyId: "",
      secretAccessKey: "",
      bucket: storageS3.bucket,
      endpoint: storageS3.endpoint,
      prefix: storageS3.prefix,
      region: extractedRegion || "",
    }
  }

  const handleSave = async (data: S3FormData) => {
    const finalEndpoint = data.providerType === "generic"
      ? data.endpoint
      : buildEndpoint(data.providerType, data.region)

    const updateData: components["schemas"]["UpdateVolumeProvider"] = {
      rustic: {
        storageS3: {
          accessKeyId: data.accessKeyId || undefined,
          secretAccessKey: data.secretAccessKey || undefined,
          bucket: data.bucket || undefined,
          endpoint: finalEndpoint || undefined,
          prefix: data.prefix || undefined,
        },
      },
    }

    return await save(updateData)
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
        <S3StorageForm
          form={form}
          showProviderTypeSelector={true}
          accessKeyPlaceholder="Enter new access key ID (leave blank to keep current)"
          secretAccessKeyPlaceholder="Enter new secret access key (leave blank to keep current)"
        />
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
      <CardContent>
        <DetailsCardLayout>
          <LabelAndValue
            label="S3 Bucket"
            textValue={storageS3.bucket}
          />

          <LabelAndValue
            label="S3 Endpoint"
            textValue={storageS3.endpoint}
          />

          <LabelAndValue
            label="S3 Prefix"
            textValue={storageS3.prefix}
          />
        </DetailsCardLayout>
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