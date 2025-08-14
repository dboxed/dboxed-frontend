import { AppSidebar } from "@/components/app-sidebar"
import { DboxedBreadcrumbs } from "@/components/DboxedBreadcrumbs"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Outlet } from "react-router";

interface MainLayoutProps {
  isAdmin?: boolean
}

export default function MainLayout({ isAdmin }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar isAdmin = {isAdmin} />
      <SidebarInset>
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DboxedBreadcrumbs />
          </div>
          <div className="ml-auto px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
