import { useLocation, useNavigate } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { ListNetworksPage } from "@/pages/networks/ListNetworksPage.tsx"
import { ListIngressProxiesPage } from "@/pages/ingress-proxies/ListIngressProxiesPage.tsx"

export function NetworkingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()

  // Determine active tab from URL path
  const activeTab = location.pathname.includes('/ingress-proxies') ? 'ingress-proxies' : 'networks'

  const handleTabChange = (value: string) => {
    if (value === 'networks') {
      navigate(`/workspaces/${workspaceId}/networks`, { replace: true })
    } else {
      navigate(`/workspaces/${workspaceId}/ingress-proxies`, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="ingress-proxies">Ingress Proxies</TabsTrigger>
        </TabsList>

        <TabsContent value="networks">
          <ListNetworksPage />
        </TabsContent>

        <TabsContent value="ingress-proxies">
          <ListIngressProxiesPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
