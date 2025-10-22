import { useEffect, useState } from "react"
import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx"
import { Button } from "@/components/ui/button.tsx"
import { ConfirmationDialog } from "@/components/ConfirmationDialog.tsx"
import { AlertTriangle, Play, StopCircle } from "lucide-react"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { BoxConnectCard } from "./BoxConnectCard.tsx"
import { LogsPage } from "./logs/LogsPage.tsx"
import { VolumesTab } from "./volumes/VolumesTab.tsx"
import { ComposeProjects } from "./compose-projects/ComposeProjects.tsx"
import type { components } from "@/api/models/schema"

function BoxDetailsContent({ data }: { data: components["schemas"]["Box"] }) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  const { data: runStatus } = client.useQuery('get', "/v1/workspaces/{workspaceId}/boxes/{id}/run-status", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: data.id,
      }
    },
  }, {
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  // Track staleness of status
  useEffect(() => {
    if (!runStatus?.statusTime) {
      setElapsedSeconds(0)
      return
    }

    const calculateElapsed = () => {
      const statusTime = new Date(runStatus.statusTime!).getTime()
      const now = Date.now()
      const elapsed = Math.floor((now - statusTime) / 1000)
      setElapsedSeconds(elapsed)
    }

    // Calculate immediately
    calculateElapsed()

    // Update every second
    const interval = setInterval(calculateElapsed, 1000)

    return () => clearInterval(interval)
  }, [runStatus?.statusTime])

  const isStale = elapsedSeconds >= 30
  const isStopped = runStatus?.runStatus === 'stopped'

  return (
    <div className="space-y-6">
      {isStale && runStatus?.statusTime && !isStopped && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Stale Status</AlertTitle>
          <AlertDescription>
            Box status has not updated for {elapsedSeconds} seconds
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
          <TabsTrigger value="compose">Compose Projects</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralInfoCard data={data} />
        </TabsContent>

        <TabsContent value="connect">
          <BoxConnectCard box={data} />
        </TabsContent>

        <TabsContent value="volumes">
          <VolumesTab box={data} />
        </TabsContent>

        <TabsContent value="compose">
          <ComposeProjects box={data} />
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

  if (!boxId) {
    return <div>Invalid box ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Box"], components["schemas"]["UpdateBox"]>
      title={data => {
        if (!data) {
          return "Box"
        }
        return `Box ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/boxes/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/boxes`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }}
      customButtons={(data, save) => (
        <>
          <ConfirmationDialog
            trigger={
              <Button
                variant="outline"
                disabled={data.desiredState === 'up'}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            }
            title="Start Box?"
            description="This will start the box and all configured containers."
            confirmText="Start"
            onConfirm={async () => {
              await save({ desiredState: 'up' })
            }}
          />
          <ConfirmationDialog
            trigger={
              <Button
                variant="outline"
                disabled={data.desiredState !== 'up'}
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop
              </Button>
            }
            title="Stop Box?"
            description="This will stop the box and all running containers."
            confirmText="Stop"
            onConfirm={async () => {
              await save({ desiredState: 'down' })
            }}
            destructive
          />
        </>
      )}
    >
      {(data, _save) => <BoxDetailsContent data={data} />}
    </BaseResourceDetailsPage>
  )
} 