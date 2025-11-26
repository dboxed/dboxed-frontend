import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { S3BucketForm, buildEndpoint, type ProviderType } from "@/pages/s3-buckets/details/S3BucketForm.tsx"
import type { ReactElement } from "react";

interface CreateS3BucketDialogProps {
  trigger: ReactElement
}

interface S3BucketFormData {
  providerType: ProviderType
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

export function CreateS3BucketDialog({ trigger }: CreateS3BucketDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const handleSubmit = (data: S3BucketFormData): components["schemas"]["CreateS3Bucket"] => {
    // Build endpoint based on provider type and region
    let endpoint = data.endpoint
    if (data.providerType !== "generic") {
      endpoint = buildEndpoint(data.providerType, data.region)
    }

    // Return only the fields needed for CreateS3Bucket API
    return {
      bucket: data.bucket,
      endpoint: endpoint,
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
    }
  }

  return (
    <BaseCreateDialog<S3BucketFormData, components["schemas"]["CreateS3Bucket"]>
      trigger={trigger}
      title="Add S3 Bucket"
      apiRoute="/v1/workspaces/{workspaceId}/s3-buckets"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        providerType: "amazon-s3",
        region: "",
        endpoint: "",
        accessKeyId: "",
        secretAccessKey: "",
        bucket: "",
      }}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <S3BucketForm
          form={form}
          showProviderTypeSelector={true}
          showPrefixField={false}
          accessKeyPlaceholder="Enter S3 Access Key ID"
          secretAccessKeyPlaceholder="Enter S3 Secret Access Key"
        />
      )}
    </BaseCreateDialog>
  )
}
