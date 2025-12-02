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
import { LogsPage } from "./logs/LogsPage.tsx"
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
          <LogsPage box={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function BoxDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { boxId } = useParams<{ boxId: string }>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const startBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/start', {
    successMessage: 'Box started successfully',
    errorMessage: 'Failed to start box',
    onSuccess: () => setRefreshTrigger(x => x + 1),
  })

  const stopBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/stop', {
    successMessage: 'Box stopped successfully',
    errorMessage: 'Failed to stop box',
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

  const handleStart = async () => {
    return await startBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
        }
      }
    })
  }

  const handleStop = async () => {
    return await stopBoxMutation.mutateAsync({
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
        if (data.desiredState === 'up') {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: Box is Running</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>This box has desired state set to "up" and may be actively running.</strong>
                  </p>
                  <p>
                    It is strongly recommended to stop the box before deletion to ensure a clean shutdown of all containers and services.
                  </p>
                  <p>
                    Click the <strong>Stop</strong> button first, wait for the box to stop, then delete it.
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
                disabled={data.desiredState === 'up' || startBoxMutation.isPending}
              >
                <Play className="h-4 w-4 mr-2" />
                {startBoxMutation.isPending ? 'Starting...' : 'Start'}
              </Button>
            }
            title="Start Box?"
            description="This will start the box and all configured containers."
            confirmText="Start"
            onConfirm={handleStart}
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    Automatic starting of sandboxes for the box is not implemented yet. This will come in a future release of dboxed.
                  </p>
                  <p>
                    This means you will need to manually run <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">dboxed sandbox run ...</code> yourself.
                  </p>
                  <p>
                    Check the <strong>Connect Box</strong> tab for details.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </ConfirmationDialog>
          <ConfirmationDialog
            trigger={
              <Button
                variant="outline"
                disabled={data.desiredState !== 'up' || stopBoxMutation.isPending}
              >
                <StopCircle className="h-4 w-4 mr-2" />
                {stopBoxMutation.isPending ? 'Stopping...' : 'Stop'}
              </Button>
            }
            title="Stop Box?"
            description="This will stop the box and all running containers."
            confirmText="Stop"
            onConfirm={handleStop}
            destructive
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
