import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { LoadBalancerConfigCard } from "./LoadBalancerConfigCard.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"

function LoadBalancerDetailsContent({
  data,
  save
}: {
  data: components["schemas"]["LoadBalancer"]
  save: (data: components["schemas"]["UpdateLoadBalancer"]) => Promise<boolean>
}) {
  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="config">Load Balancer Config</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralInfoCard data={data} />
      </TabsContent>
      <TabsContent value="config">
        <LoadBalancerConfigCard data={data} save={save} />
      </TabsContent>
    </Tabs>
  )
}

export function LoadBalancerDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { loadBalancerId } = useParams<{ loadBalancerId: string }>()

  if (!loadBalancerId) {
    return <div>Invalid Load Balancer ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["LoadBalancer"], components["schemas"]["UpdateLoadBalancer"]>
      title={data => {
        if (!data) {
          return "Load Balancer"
        }
        return `Load Balancer ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/load-balancers/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/load-balancers`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: loadBalancerId,
        }
      }}
    >
      {(data, save) => <LoadBalancerDetailsContent data={data} save={save} />}
    </BaseResourceDetailsPage>
  )
}
