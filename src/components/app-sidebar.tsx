import { Box, LayoutDashboard, Monitor, Network, Users, HardDrive } from "lucide-react"

import { NavItems } from "@/components/nav-items.tsx"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher.tsx"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/api/auth.ts";

const navMain = [
  {
    title: "Dashboard",
    navigate: "/workspaces/{workspaceId}",
    icon: LayoutDashboard,
  },
  {
    title: "Networks",
    navigate: "/workspaces/{workspaceId}/networks",
    icon: Network,
  },
  {
    title: "Volumes",
    navigate: "/workspaces/{workspaceId}/volumes",
    icon: HardDrive,
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
  const user = useCurrentUser()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher/>
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
