import { BaseResourceDetailsPage } from "@/pages/base/BaseResourceDetailsPage.tsx"
import { useParams } from "react-router"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { GeneralInfoCard } from "./GeneralInfoCard.tsx"
import { ProxyConfigCard } from "./ProxyConfigCard.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"

function IngressProxyDetailsContent({
  data,
  save
}: {
  data: components["schemas"]["IngressProxy"]
  save: (data: components["schemas"]["UpdateIngressProxy"]) => Promise<boolean>
}) {
  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="config">Ingress Proxy Config</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralInfoCard data={data} />
      </TabsContent>
      <TabsContent value="config">
        <ProxyConfigCard data={data} save={save} />
      </TabsContent>
    </Tabs>
  )
}

export function IngressProxyDetailsPage() {
  const { workspaceId } = useSelectedWorkspaceId()
  const { proxyId } = useParams<{ proxyId: string }>()

  if (!proxyId) {
    return <div>Invalid proxy ID</div>
  }

  return (
    <BaseResourceDetailsPage<components["schemas"]["IngressProxy"], components["schemas"]["UpdateIngressProxy"]>
      title={data => {
        if (!data) {
          return "Ingress Proxy"
        }
        return `Ingress Proxy ${data.name}`
      }}
      resourcePath="/v1/workspaces/{workspaceId}/ingress-proxies/{id}"
      enableDelete={true}
      afterDeleteUrl={`/workspaces/${workspaceId}/ingress-proxies`}
      apiParams={{
        path: {
          workspaceId: workspaceId,
          id: proxyId,
        }
      }}
    >
      {(data, save) => <IngressProxyDetailsContent data={data} save={save} />}
    </BaseResourceDetailsPage>
  )
}
