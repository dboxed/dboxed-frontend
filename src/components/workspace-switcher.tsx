import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"
import type { components } from "@/api/models/schema";
import { useLocation, useNavigate } from "react-router";
import { useDboxedQueryClient } from "@/api/api.ts";
import { useCurrentUser, useIsAdmin } from "@/api/auth.ts";

export function useSelectedWorkspaceId() {
  const location = useLocation()
  const navigate = useNavigate()

  if (!location.pathname.startsWith("/workspaces/")) {
    return {
      workspaceId: null,
      setWorkspaceId: (id: number) => {
        navigate(`/workspaces/${id}`)
      },
    }
  }

  const s = location.pathname.split("/")
  const workspaceIdNum = parseInt(s[2]) || null

  const setWorkspaceId = (id: number) => {
    s[2] = id + ""
    const newLocation = s.join("/")
    navigate(newLocation)
  }

  return {
    workspaceId: workspaceIdNum,
    setWorkspaceId: setWorkspaceId,
  }
}

export function WorkspaceSwitcher({
}: {
}) {
  const navigate = useNavigate()
  const client = useDboxedQueryClient()
  const isAdminQuery = useIsAdmin()

  const { isMobile } = useSidebar()

  const curUserWorkspaces = client.useQuery('get', '/v1/workspaces')
  const adminWorkspaces = client.useQuery('get', '/v1/admin/workspaces', {}, {
    enabled: isAdminQuery.isAdmin
  })

  const { workspaceId, setWorkspaceId} = useSelectedWorkspaceId()
  const knownWorkspaces = adminWorkspaces.data?.items || curUserWorkspaces.data?.items || []
  const selectedWorkspace = knownWorkspaces.find(w => w.id == workspaceId)
  
  // Check if selected workspace is in user's accessible workspaces (not admin view)
  const isWorkspaceAccessible = curUserWorkspaces.data?.items?.find(w => w.id == workspaceId)
  const isWorkspaceNotAccessible = workspaceId && !isWorkspaceAccessible

  const handleSelectWorkspace = (w: components["schemas"]["Workspace"]) => {
    setWorkspaceId(w.id)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isWorkspaceNotAccessible ? 'text-red-600 hover:text-red-700' : ''
              }`}
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Workspace</span>
                {selectedWorkspace && <span className="truncate text-xs">{selectedWorkspace.name}</span>}
                {!selectedWorkspace && <span className="truncate text-xs">Selected workspace not found!</span>}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {curUserWorkspaces.data?.items?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.name}
                onSelect={() => handleSelectWorkspace(workspace)}
                className="gap-2 p-2"
              >
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onSelect={() => navigate("/workspaces/create")}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
