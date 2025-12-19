import { Box, LayoutDashboard, Users, HardDrive, Key, BookOpen, Globe, Monitor, GitBranch } from "lucide-react"

import { NavItems } from "@/components/nav-items.tsx"
import { NavUser } from "@/components/nav-user"
import { WorkspaceSwitcher } from "@/components/workspace-switcher.tsx"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarSeparator } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/api/auth.ts";
import { FaXTwitter, FaGithub, FaMoneyBills } from 'react-icons/fa6';
import { isDboxedCloud } from "@/env.ts";

const navMain = [
  {
    title: "Dashboard",
    navigate: "/workspaces/{workspaceId}",
    icon: <LayoutDashboard/>,
  },
  {
    title: "Tokens",
    navigate: "/workspaces/{workspaceId}/tokens",
    icon: <Key/>,
  },
  {
    title: "Networking",
    navigate: "/workspaces/{workspaceId}/networks",
    icon: <Globe/>,
  },
  {
    title: "Storage",
    navigate: "/workspaces/{workspaceId}/volumes",
    icon: <HardDrive/>,
  },
  {
    title: "Git",
    navigate: "/workspaces/{workspaceId}/git-specs",
    icon: <GitBranch/>,
  },
  {
    title: "Boxes",
    navigate: "/workspaces/{workspaceId}/boxes",
    icon: <Box/>,
  },
  {
    title: "Machines",
    navigate: "/workspaces/{workspaceId}/machines",
    icon: <Monitor/>,
  },
]

const navWorkspace = [
  {
    title: "Billing",
    navigate: "/workspaces/{workspaceId}/billing",
    icon: <FaMoneyBills/>,
  },
]

const navAdmin = [
  {
    title: "All Workspaces",
    navigate: "/admin/workspaces",
    icon: <LayoutDashboard/>,
  },
  {
    title: "Users",
    navigate: "/admin/users",
    icon: <Users/>,
  },
]

const navResources = [
  {
    title: "Documentation",
    url: "https://dboxed.io/docs",
    icon: <BookOpen/>,
  },
  {
    title: "@dboxed_io",
    url: "https://x.com/dboxed_io",
    icon: <FaXTwitter/>,
  },
  {
    title: "dboxed/dboxed",
    url: "https://github.com/dboxed/dboxed",
    icon: <FaGithub/>,
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

        <div className="flex-1" />
        {isDboxedCloud() &&
            <NavItems title={"Workspace"} items={navWorkspace}/>
        }
        {isAdmin &&
          <NavItems title={"Admin"} items={navAdmin}/>
        }
        <NavItems title={"Resources"} items={navResources}/>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <NavUser user={user.user}/>
      </SidebarFooter>
      <SidebarRail/>
    </Sidebar>
  )
}
