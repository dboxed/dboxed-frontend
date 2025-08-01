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

interface MachineProvidersBreadcrumbProps {
  isCurrentPage?: boolean
}

function MachineProvidersBreadcrumb({ isCurrentPage }: MachineProvidersBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/machine-providers`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Machine Providers</span>
    </BreadcrumbElement>
  )
}

interface MachineProviderBreadcrumbProps {
  machineProviderId: number
  isCurrentPage?: boolean
}

function MachineProviderBreadcrumb({ machineProviderId, isCurrentPage }: MachineProviderBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const machineProvider = client.useQuery('get', '/v1/workspaces/{workspaceId}/machine-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: machineProviderId
      }
    },
  }, {
    enabled: !!workspaceId && !!machineProviderId
  })

  const href = `/workspaces/${workspaceId}/machine-providers/${machineProviderId}`
  const label = machineProvider.data?.name || 'Machine Provider'

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

interface NetworkBreadcrumbProps {
  networkId: number
  isCurrentPage?: boolean
}

function NetworkBreadcrumb({ networkId, isCurrentPage }: NetworkBreadcrumbProps) {
  const navigate = useNavigate()
  const client = useUnboxedQueryClient()
  const { workspaceId } = useSelectedWorkspaceId()

  const network = client.useQuery('get', '/v1/workspaces/{workspaceId}/networks/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: networkId
      }
    },
  }, {
    enabled: !!workspaceId && !!networkId
  })

  const href = `/workspaces/${workspaceId}/networks/${networkId}`
  const label = network.data?.name || 'Network'

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

interface BoxesBreadcrumbProps {
  isCurrentPage?: boolean
}

function BoxesBreadcrumb({ isCurrentPage }: BoxesBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/boxes`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Boxes</span>
    </BreadcrumbElement>
  )
}

interface BoxBreadcrumbProps {
  boxId: number
  isCurrentPage?: boolean
}

function BoxBreadcrumb({ boxId, isCurrentPage }: BoxBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const box = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: boxId
      }
    },
  }, {
    enabled: !!workspaceId && !!boxId
  })

  const href = `/workspaces/${workspaceId}/boxes/${boxId}`
  const label = box.data?.name || 'Box'

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
      <BreadcrumbSeparator key="sep-dashboard" className="hidden md:block"/>,
      <BreadcrumbItem key="workspace">
        <WorkspaceBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex = 2 // Skip 'workspaces' and workspace ID
  }

  // Handle machine-providers path
  if (pathSegments[currentIndex] === 'machine-providers') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-machine-providers"/>,
      <BreadcrumbItem key="machine-providers">
        <MachineProvidersBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific machine provider ID
    const machineProviderIdSegment = pathSegments[currentIndex]
    if (machineProviderIdSegment && machineProviderIdSegment.match(/^\d+$/)) {
      const machineProviderId = parseInt(machineProviderIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-machine-providers"/>,
        <BreadcrumbItem key="machine-provider">
          <MachineProviderBreadcrumb
            machineProviderId={machineProviderId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-machine-provider"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle machines path
  if (pathSegments[currentIndex] === 'machines') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-machines"/>,
      <BreadcrumbItem key="machines">
        <MachinesBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific machine ID
    const machineIdSegment = pathSegments[currentIndex]
    if (machineIdSegment && machineIdSegment.match(/^\d+$/)) {
      const machineId = parseInt(machineIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-machines"/>,
        <BreadcrumbItem key="machine">
          <MachineBreadcrumb
            machineId={machineId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-machine"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle networks path
  if (pathSegments[currentIndex] === 'networks') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-networks"/>,
      <BreadcrumbItem key="networks">
        <BreadcrumbElement isCurrentPage={isCurrentPage}>
          <span>Networks</span>
        </BreadcrumbElement>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific network ID
    const networkIdSegment = pathSegments[currentIndex]
    if (networkIdSegment && networkIdSegment.match(/^\d+$/)) {
      const networkId = parseInt(networkIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-networks"/>,
        <BreadcrumbItem key="network">
          <NetworkBreadcrumb
            networkId={networkId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-network"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle boxes path
  if (pathSegments[currentIndex] === 'boxes') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-boxes"/>,
      <BreadcrumbItem key="boxes">
        <BoxesBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific box ID
    const boxIdSegment = pathSegments[currentIndex]
    if (boxIdSegment && boxIdSegment.match(/^\d+$/)) {
      const boxId = parseInt(boxIdSegment)
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-boxes"/>,
        <BreadcrumbItem key="box">
          <BoxBreadcrumb
            boxId={boxId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-box"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle workspace create path (outside the main layout)
  if (pathSegments[0] === 'workspaces' && pathSegments[1] === 'create') {
    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspaces" className="hidden md:block"/>,
      <BreadcrumbItem key="workspaces">
        <BreadcrumbElement isCurrentPage={false}>
          <span>Workspaces</span>
        </BreadcrumbElement>
      </BreadcrumbItem>,
      <BreadcrumbSeparator key="sep-create-workspace"/>,
      <BreadcrumbItem key="create">
        <CreateBreadcrumb isCurrentPage={true}/>
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