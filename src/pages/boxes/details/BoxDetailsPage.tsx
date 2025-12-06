import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { AlertTriangle, Play, StopCircle, RefreshCw } from "lucide-react"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { BoxRunCard } from "./BoxRunCard.tsx"
import { LogsCard } from "../../logs/LogsCard.tsx"
import { BoxConfigTab } from "./BoxConfigTab.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useDboxedMutation } from "@/api/mutation.ts"
import { useState } from "react";

function BoxDetailsContent({ data }: { data: components["schemas"]["Box"] }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="box-config">Config</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralInfoCard box={data} />
        </TabsContent>

        <TabsContent value="run">
          <BoxRunCard box={data} />
        </TabsContent>

        <TabsContent value="box-config">
          <BoxConfigTab box={data} />
        </TabsContent>

        <TabsContent value="logs">
          <LogsCard ownerType="box" ownerId={data.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function BoxDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { boxId } = useParams<{ boxId: string }>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const enableBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/enable', {
    successMessage: 'Box enabled successfully',
    errorMessage: 'Failed to enable box',
    onSuccess: () => setRefreshTrigger(x => x + 1),
  })

  const disableBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/disable', {
    successMessage: 'Box disabled successfully',
    errorMessage: 'Failed to disable box',
    onSuccess: () => setRefreshTrigger(x => x + 1),
  })

  const reconcileBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/reconcile', {
    successMessage: 'Box reconcile triggered successfully',
    errorMessage: 'Failed to reconcile box',
    onSuccess: () => setRefreshTrigger(x => x + 1),
  })

  if (!boxId) {
    return <div>Invalid box ID</div>
  }

  const handleEnable = async () => {
    return await enableBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
        }
      }
    })
  }

  const handleDisable = async () => {
    return await disableBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
        }
      }
    })
  }

  const handleReconcile = async () => {
    return await reconcileBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
        }
      }
    })
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Box"], any>
      title={data => {
        if (!data) {
          return "Box"
        }
        return `Box ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
      refreshTrigger={refreshTrigger}
      enableDelete={data => data.boxType === "normal"}
      afterDeleteUrl={`/workspaces/${workspaceId}/boxes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }}
      deleteConfirmationChildren={(data) => {
        if (data.enabled) {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: Box is Enabled</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>This box is enabled and may be actively running.</strong>
                  </p>
                  <p>
                    It is strongly recommended to disable the box before deletion to ensure a clean shutdown of all containers and services.
                  </p>
                  <p>
                    Click the <strong>Disable</strong> button first, wait for the box to stop, then delete it.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )
        }
        return null
      }}
      customButtons={(data, _save) => (
        <>
          <ConfirmationDialog
            trigger={
              <Button
                variant="outline"
                disabled={enableBoxMutation.isPending || disableBoxMutation.isPending}
              >
                {data.enabled ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    {disableBoxMutation.isPending ? 'Disabling...' : 'Disable'}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {enableBoxMutation.isPending ? 'Enabling...' : 'Enable'}
                  </>
                )}
              </Button>
            }
            title={data.enabled ? "Disable Box?" : "Enable Box?"}
            description={data.enabled
              ? "This will disable the box and stop all running containers."
              : "This will enable the box and start all configured containers."
            }
            confirmText={data.enabled ? "Disable" : "Enable"}
            onConfirm={data.enabled ? handleDisable : handleEnable}
            destructive={data.enabled}
          />
          <ConfirmationDialog
            trigger={
              <Button
                variant="outline"
                disabled={reconcileBoxMutation.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {reconcileBoxMutation.isPending ? 'Reconciling...' : 'Reconcile'}
              </Button>
            }
            title="Reconcile Box?"
            description="This will trigger a reconciliation of the box state with the desired configuration."
            confirmText="Reconcile"
            onConfirm={handleReconcile}
          />
        </>
      )}
    >
      {(data, _save) => <BoxDetailsContent data={data} />}
    </BaseResourceDetailsPage>
  )
}
