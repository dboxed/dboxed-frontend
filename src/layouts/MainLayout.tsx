import { AppSidebar } from "@/components/app-sidebar"
import { DboxedBreadcrumbs } from "@/components/DboxedBreadcrumbs"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Outlet } from "react-router";
import { EarlyStageWarningBanner } from "@/components/EarlyStageWarningBanner.tsx";

interface MainLayoutProps {
  isAdmin?: boolean
}

export default function MainLayout({ isAdmin }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar isAdmin = {isAdmin} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DboxedBreadcrumbs />
          </div>
          <div className="ml-auto flex items-center gap-4 px-4">
            <EarlyStageWarningBanner />
            <ModeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            <Outlet/>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
