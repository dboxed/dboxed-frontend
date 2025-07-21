import * as React from "react"
import { Cloud, } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher.tsx"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/api/auth.ts";
import { useUnboxedQueryClient } from "@/api/api.ts";

const navMain = [
  {
    title: "Cloud Providers",
    navigate: "/workspaces/{workspaceId}/cloud-providers",
    icon: Cloud,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const client = useUnboxedQueryClient()
  const user = useCurrentUser()
  const workspaces = client.useQuery('get', '/v1/workspaces')

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces.data?.items || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
