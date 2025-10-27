import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import type { components } from "@/api/models/schema"

export function S3BucketDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { s3BucketId } = useParams<{ s3BucketId: string }>()

  if (!s3BucketId) {
    return <div>Invalid S3 bucket ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["S3Bucket"], components["schemas"]["UpdateS3Bucket"]>
      title={data => {
        if (!data) {
          return "S3 Bucket"
        }
        return `S3 Bucket: ${data.bucket}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/s3-buckets/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/s3-buckets`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: s3BucketId,
        }
      }}
    >
      {(data) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="general">General Information</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
}
