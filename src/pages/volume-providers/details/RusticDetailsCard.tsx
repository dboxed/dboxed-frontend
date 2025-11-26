import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/dboxed-schema"

interface RusticDetailsCardProps {
  volumeProvider: components["schemas"]["VolumeProvider"]
  save: (newBox: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

export function RusticDetailsCard({ volumeProvider, save }: RusticDetailsCardProps) {
  if (!volumeProvider.rustic) {
    return <div>Invalid volume provider</div>
  }

  const handlePasswordUpdate = async (newPassword: string) => {
    return await save({
      rustic: {
        password: newPassword
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rustic Configuration</CardTitle>
        <CardDescription>
          Rustic volume provider configuration settings. Sensitive credentials are not displayed for security reasons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LabelAndValue
          label="Storage Type"
          textValue={volumeProvider.rustic.storageType}
        />

        {volumeProvider.rustic.s3BucketId && (
          <LabelAndValue
            label="S3 Bucket"
            value={
              <ReferenceLabel
                resourceId={volumeProvider.rustic.s3BucketId}
                resourcePath="/v1/workspaces/{workspaceId}/s3-buckets/{id}"
                pathParams={{
                  workspaceId: volumeProvider.workspace,
                  id: volumeProvider.rustic.s3BucketId
                }}
                detailsUrl={`/workspaces/${volumeProvider.workspace}/s3-buckets/${volumeProvider.rustic.s3BucketId}`}
                fallbackLabel="S3 Bucket"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              />
            }
          />
        )}

        <LabelAndValue
          label="Storage Prefix"
          textValue={volumeProvider.rustic.storagePrefix}
        />

        <LabelAndValue
          label={"Password"}
          value={
            <div className="flex items-center space-x-2">
              <Input
                type="password"
                value="••••••••"
                readOnly
                className="flex-1"
              />
              <SimpleInputDialog
                trigger={<Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  Update
                </Button>}
                title="Update Rustic Password"
                fieldLabel="New Password"
                placeholder="Enter new password"
                onSave={handlePasswordUpdate}
              />
            </div>
        }
        />
      </CardContent>
    </Card>
  )
}