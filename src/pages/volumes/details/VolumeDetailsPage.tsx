import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { MountStatusCard } from "./MountStatusCard.tsx"
import { RusticVolumeInfo } from "./RusticVolumeInfo.tsx"
import { SnapshotsTab } from "./SnapshotsTab.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertTriangle, Unlock } from "lucide-react"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema";

export function VolumeDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeId } = useParams<{ volumeId: string }>()

  if (!volumeId) {
    return <div>Invalid volume ID</div>
  }

  const forceReleaseMountMutation = useDboxedMutation(
    'post',
    '/v1/workspaces/{workspaceId}/volumes/{id}/force-release-mount',
    {
      successMessage: "Volume has been released!",
      errorMessage: "Failed to release volume",
      refetchPath: "/v1/workspaces/{workspaceId}/volumes/{id}",
    }
  )

  const handleForceRelease = async () => {
    return await forceReleaseMountMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: volumeId,
        }
      }
    })
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Volume"], any>
      title="Volume"
      resourcePath="/v1/workspaces/{workspaceId}/volumes/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/volumes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: volumeId,
        }
      }}
      customButtons={(data) => (
        <>
          {data.mountId && (
            <ConfirmationDialog
              trigger={
                <Button variant="outline">
                  <Unlock className="h-4 w-4 mr-2" />
                  Force Release Mount
                </Button>
              }
              title="Force release mounted Volume?"
              description="This will forcefully release the mounted volume."
              confirmText="Force Release"
              onConfirm={handleForceRelease}
              destructive
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Force releasing a mounted volume can be dangerous if it is actively in use.</strong>
                    </p>
                    <p>
                      Only use this option if you are certain the volume is not being used, or if the mount is stale due to a crashed machine/server.
                    </p>
                    <p>
                      {data.mountStatus?.boxId && (
                        <>Currently mounted by Box ID: <strong>{data.mountStatus.boxId}</strong></>
                      )}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </ConfirmationDialog>
          )}
        </>
      )}
    >
      {(data) => (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GeneralInfoCard data={data} />
                <MountStatusCard volumeId={volumeId} />
              </div>
              {data.volumeProviderType === "rustic" && data.rustic && (
                <RusticVolumeInfo data={data} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="snapshots">
            <SnapshotsTab volumeId={volumeId} />
          </TabsContent>
        </Tabs>
      )}
    </BaseResourceDetailsPage>
  )
}