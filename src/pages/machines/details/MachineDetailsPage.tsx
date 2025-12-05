import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { GeneralInfoCard } from "./GeneralInfoCard"
import { MachineProviderInfoCard } from "./MachineProviderInfoCard"
import { BoxesCard } from "./BoxesCard"
import { MachineConnectCard } from "./MachineConnectCard"
import { LogsCard } from "@/pages/logs/LogsCard.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { cn } from "@/lib/utils.ts";

export function MachineDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { machineId } = useParams<{ machineId: string }>()

  if (!machineId) {
    return <div>Invalid machine ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["Machine"], components["schemas"]["UpdateMachine"]>
      title={data => {
        if (!data) {
          return "Machine"
        }
        return `Machine ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/machines`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: machineId,
        }
      }}
    >
      {(data) => {
        const hasMachineProvider = !!data.machineProvider
        return <Tabs defaultValue="general" className="space-y-6">
          <TabsList className={cn("grid w-full", hasMachineProvider ? "grid-cols-5" : "grid-cols-4")}>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
            <TabsTrigger value="boxes">Boxes</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            {hasMachineProvider && <TabsTrigger value="machine-provider">Machine Provider</TabsTrigger>}
          </TabsList>

          <TabsContent value="general">
            <GeneralInfoCard data={data} />
          </TabsContent>

          <TabsContent value="connect">
            <MachineConnectCard machine={data} />
          </TabsContent>

          <TabsContent value="boxes">
            <BoxesCard machineId={data.id} workspaceId={data.workspace} />
          </TabsContent>

          <TabsContent value="logs">
            <LogsCard ownerType="machine" ownerId={data.id} />
          </TabsContent>

          {hasMachineProvider && <TabsContent value="machine-provider">
            <MachineProviderInfoCard
              machineProviderId={data.machineProvider!}
              machineProviderType={data.machineProviderType!}
              workspaceId={data.workspace}
            />
          </TabsContent>}
        </Tabs>
      }}
    </BaseResourceDetailsPage>
  )
} 