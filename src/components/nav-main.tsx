"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useNavigate, useParams } from "react-router";

interface Item {
  title: string
  url?: string
  navigate?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Item[]
}

export function NavMain({
  items,
}: {
  items: Item[]
}) {
  const navigate = useNavigate()
  const { workspaceId } = useParams();

  const handleSelect = (item: Item) => {
    if (item.navigate) {
      const l = item.navigate.replace('{workspaceId}', workspaceId || 'invalid')
      navigate(l)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dboxed</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} onClick={() => handleSelect(item)}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.items && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton onClick={() => handleSelect(item)}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
