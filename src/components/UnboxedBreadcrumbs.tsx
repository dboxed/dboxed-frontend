import * as React from "react"
import { useLocation, useNavigate } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useUnboxedQueryClient } from "@/api/api"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher"

interface BreadcrumbElementProps {
  href?: string
  isCurrentPage?: boolean
  onClick?: () => void
  children: React.ReactNode
}

function BreadcrumbElement({ href, isCurrentPage, onClick, children }: BreadcrumbElementProps) {
  if (href && !isCurrentPage) {
    return (
      <BreadcrumbLink
        onClick={(e) => {
          e.preventDefault()
          onClick?.()
        }}
        className="cursor-pointer flex items-center gap-1"
      >
        {children}
      </BreadcrumbLink>
    )
  }

  return (
    <BreadcrumbPage className="flex items-center gap-1">
      {children}
    </BreadcrumbPage>
  )
}

interface WorkspaceBreadcrumbProps {
  isCurrentPage?: boolean
}

function WorkspaceBreadcrumb({ isCurrentPage }: WorkspaceBreadcrumbProps) {
  const navigate = useNavigate()
  const client = useUnboxedQueryClient()
  const { workspaceId } = useSelectedWorkspaceId()

  const workspace = client.useQuery('get', '/v1/workspaces/{workspaceId}', {
    params: { path: { workspaceId: workspaceId! } },
  })

  const href = `/workspaces/${workspaceId}`
  const label = workspace.data?.name || 'Workspace'

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>{label}</span>
    </BreadcrumbElement>
  )
}

interface CloudProvidersBreadcrumbProps {
  isCurrentPage?: boolean
}

function CloudProvidersBreadcrumb({ isCurrentPage }: CloudProvidersBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/cloud-providers`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Cloud Providers</span>
    </BreadcrumbElement>
  )
}

interface CloudProviderBreadcrumbProps {
  cloudProviderId: number
  isCurrentPage?: boolean
}

function CloudProviderBreadcrumb({ cloudProviderId, isCurrentPage }: CloudProviderBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const cloudProvider = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers/{id}', {
    params: { 
      path: { 
        workspaceId: workspaceId!,
        id: cloudProviderId 
      } 
    },
  }, {
    enabled: !!workspaceId && !!cloudProviderId
  })

  const href = `/workspaces/${workspaceId}/cloud-providers/${cloudProviderId}`
  const label = cloudProvider.data?.name || 'Cloud Provider'

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>{label}</span>
    </BreadcrumbElement>
  )
}

interface MachinesBreadcrumbProps {
  isCurrentPage?: boolean
}

function MachinesBreadcrumb({ isCurrentPage }: MachinesBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/machines`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Machines</span>
    </BreadcrumbElement>
  )
}

interface MachineBreadcrumbProps {
  machineId: number
  isCurrentPage?: boolean
}

function MachineBreadcrumb({ machineId, isCurrentPage }: MachineBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const machine = client.useQuery('get', '/v1/workspaces/{workspaceId}/machines/{id}', {
    params: { 
      path: { 
        workspaceId: workspaceId!,
        id: machineId 
      } 
    },
  }, {
    enabled: !!workspaceId && !!machineId
  })

  const href = `/workspaces/${workspaceId}/machines/${machineId}`
  const label = machine.data?.name || 'Machine'

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>{label}</span>
    </BreadcrumbElement>
  )
}

interface BoxSpecBreadcrumbProps {
  isCurrentPage?: boolean
}

function BoxSpecBreadcrumb({ isCurrentPage }: BoxSpecBreadcrumbProps) {
  return (
    <BreadcrumbElement isCurrentPage={isCurrentPage}>
      <span>Box Spec</span>
    </BreadcrumbElement>
  )
}

interface CreateBreadcrumbProps {
  isCurrentPage?: boolean
}

function CreateBreadcrumb({ isCurrentPage }: CreateBreadcrumbProps) {
  return (
    <BreadcrumbElement isCurrentPage={isCurrentPage}>
      <span>Create</span>
    </BreadcrumbElement>
  )
}

interface UnboxedBreadcrumbsProps {
  className?: string
}

export function UnboxedBreadcrumbs({ className }: UnboxedBreadcrumbsProps) {
  const location = useLocation()

  // Parse the current path to determine what breadcrumbs to show
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbElements: React.ReactNode[] = []

  breadcrumbElements.push(
    <BreadcrumbItem key="root">
      <BreadcrumbElement
        isCurrentPage={true}
      >
        <span>Workspaces</span>
      </BreadcrumbElement>
    </BreadcrumbItem>
  )

  let currentIndex = 0

  // Add workspace breadcrumb if we're in a workspace context
  if (pathSegments[0] === 'workspaces') {
    const isCurrentPage = pathSegments.length === 2
    
    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-dashboard" className="hidden md:block" />,
      <BreadcrumbItem key="workspace">
        <WorkspaceBreadcrumb isCurrentPage={isCurrentPage} />
      </BreadcrumbItem>
    )
    
    currentIndex = 2 // Skip 'workspaces' and workspace ID
  }

  // Handle cloud-providers path
  if (pathSegments[currentIndex] === 'cloud-providers') {
    const isCurrentPage = pathSegments.length === currentIndex + 1
    
    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-cloud-providers" />,
      <BreadcrumbItem key="cloud-providers">
        <CloudProvidersBreadcrumb isCurrentPage={isCurrentPage} />
      </BreadcrumbItem>
    )
    
    currentIndex++

    // Handle specific cloud provider ID
    const cloudProviderIdSegment = pathSegments[currentIndex]
    if (cloudProviderIdSegment && cloudProviderIdSegment.match(/^\d+$/)) {
      const cloudProviderId = parseInt(cloudProviderIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1
      
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-cloud-providers" />,
        <BreadcrumbItem key="cloud-provider">
          <CloudProviderBreadcrumb
            cloudProviderId={cloudProviderId} 
            isCurrentPage={isCurrentPage} 
          />
        </BreadcrumbItem>
      )
      
      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-cloud-provider" />,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true} />
        </BreadcrumbItem>
      )
    }
  }

  // Handle machines path
  if (pathSegments[currentIndex] === 'machines') {
    const isCurrentPage = pathSegments.length === currentIndex + 1
    
    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-machines" />,
      <BreadcrumbItem key="machines">
        <MachinesBreadcrumb isCurrentPage={isCurrentPage} />
      </BreadcrumbItem>
    )
    
    currentIndex++

    // Handle specific machine ID
    const machineIdSegment = pathSegments[currentIndex]
    if (machineIdSegment && machineIdSegment.match(/^\d+$/)) {
      const machineId = parseInt(machineIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1
      
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-machines" />,
        <BreadcrumbItem key="machine">
          <MachineBreadcrumb
            machineId={machineId} 
            isCurrentPage={isCurrentPage} 
          />
        </BreadcrumbItem>
      )
      
      currentIndex++

      // Handle box-spec path after machine ID
      if (pathSegments[currentIndex] === 'box-spec') {
        breadcrumbElements.push(
          <BreadcrumbSeparator key="sep-box-spec" />,
          <BreadcrumbItem key="box-spec">
            <BoxSpecBreadcrumb isCurrentPage={true} />
          </BreadcrumbItem>
        )
      }
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-machine" />,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true} />
        </BreadcrumbItem>
      )
    }
  }

  // Handle workspace create path (outside the main layout)
  if (pathSegments[0] === 'workspaces' && pathSegments[1] === 'create') {
    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspaces" className="hidden md:block" />,
      <BreadcrumbItem key="workspaces">
        <BreadcrumbElement isCurrentPage={false}>
          <span>Workspaces</span>
        </BreadcrumbElement>
      </BreadcrumbItem>,
      <BreadcrumbSeparator key="sep-create-workspace" />,
      <BreadcrumbItem key="create">
        <CreateBreadcrumb isCurrentPage={true} />
      </BreadcrumbItem>
    )
  }

  // Don't render if we only have the dashboard breadcrumb
  if (breadcrumbElements.length <= 1) {
    return null
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbElements}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 