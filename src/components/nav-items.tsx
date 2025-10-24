"use client"

import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
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
import type { ReactElement } from "react";

interface Item {
  title: string
  url?: string
  navigate?: string
  icon?: ReactElement
  isActive?: boolean
  items?: Item[]
}

function NavButton({item}: {item: Item}) {
  const navigate = useNavigate()
  const { workspaceId } = useParams();

  const handleSelect = (item: Item) => {
    if (item.navigate) {
      const l = item.navigate.replace('{workspaceId}', workspaceId || 'invalid')
      navigate(l)
    }
  }

  const button = <SidebarMenuButton tooltip={item.title} onClick={() => handleSelect(item)} className={item.url ? "cursor-pointer" : ""}>
    {item.icon }
    <span>{item.title}</span>
    {item.items && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
  </SidebarMenuButton>

  if (item.url) {
    return <a href={item.url} target={"_blank"}>{button}</a>
  } else {
    return button
  }
}

export function NavItems({
  title,
  items,
}: {
  title: string,
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
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
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
                <NavButton item={item}/>
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
