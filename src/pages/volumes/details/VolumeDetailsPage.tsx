import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { RusticVolumeInfo } from "./RusticVolumeInfo.tsx"
import { SnapshotsTab } from "./SnapshotsTab.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { AlertTriangle, Unlock } from "lucide-react"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function VolumeDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { volumeId } = useParams<{ volumeId: string }>()
  const client = useDboxedQueryClient()
  const queryClient = useQueryClient()

  if (!volumeId) {
    return <div>Invalid volume ID</div>
  }

  const forceUnlockMutation = client.useMutation(
    'post',
    '/v1/workspaces/{workspaceId}/volumes/{id}/force-unlock'
  )

  const handleForceUnlock = async () => {
    forceUnlockMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: parseInt(volumeId),
        }
      }
    }, {
      onSuccess: () => {
        toast.success("Volume has been unlocked!")
        queryClient.invalidateQueries({ queryKey: ['get', '/v1/workspaces/{workspaceId}/volumes/{id}'] })
      },
      onError: (error) => {
        toast.error("Failed to delete compose project", {
          description: error.detail || "An error occurred while deleting the compose project."
        })
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
          {data.lockId && (
            <ConfirmationDialog
              trigger={
                <Button variant="outline">
                  <Unlock className="h-4 w-4 mr-2" />
                  Force Unlock
                </Button>
              }
              title="Force Unlock Volume?"
              description="This will forcefully unlock the volume."
              confirmText="Force Unlock"
              onConfirm={handleForceUnlock}
              destructive
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning: Force Unlock</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Force unlocking a volume can be dangerous if it is actively in use.</strong>
                    </p>
                    <p>
                      Only use this option if you are certain the volume is not being used, or if the lock is stale due to a crashed machine/server.
                    </p>
                    <p>
                      {data.lockBoxId && (
                        <>Currently locked by Box ID: <strong>{data.lockBoxId}</strong></>
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
              <GeneralInfoCard data={data} />
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