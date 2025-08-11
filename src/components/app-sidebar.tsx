import { Box, Cloud, LayoutDashboard, Monitor, Network, Users } from "lucide-react"

import { NavItems } from "@/components/nav-items.tsx"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher.tsx"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/api/auth.ts";
import { useDboxedQueryClient } from "@/api/api.ts";

const navMain = [
  {
    title: "Dashboard",
    navigate: "/workspaces/{workspaceId}",
    icon: LayoutDashboard,
  },
  {
    title: "Machine Providers",
    navigate: "/workspaces/{workspaceId}/machine-providers",
    icon: Cloud,
  },
  {
    title: "Networks",
    navigate: "/workspaces/{workspaceId}/networks",
    icon: Network,
  },
  {
    title: "Boxes",
    navigate: "/workspaces/{workspaceId}/boxes",
    icon: Box,
  },
  {
    title: "Machines",
    navigate: "/workspaces/{workspaceId}/machines",
    icon: Monitor,
  },
]

const navAdmin = [
  {
    title: "All Workspaces",
    navigate: "/admin/workspaces",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    navigate: "/admin/users",
    icon: Users,
  },
]

interface AppSidebarProps {
  isAdmin?: boolean | undefined
}

export function AppSidebar({ isAdmin }: AppSidebarProps) {
  const client = useDboxedQueryClient()
  const user = useCurrentUser()
  const workspaces = client.useQuery('get', '/v1/workspaces')

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces.data?.items || []}/>
      </SidebarHeader>
      <SidebarContent>
        <NavItems title={"DBoxed"} items={navMain}/>
      </SidebarContent>
      {isAdmin && <SidebarContent>
        <NavItems title={"Admin"} items={navAdmin}/>
      </SidebarContent>}
      <SidebarFooter>
        <NavUser user={user.user}/>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
