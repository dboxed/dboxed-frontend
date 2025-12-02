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
import { useDboxedQueryClient } from "@/api/client.ts"
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
  const client = useDboxedQueryClient()
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
  machineProviderId: string
  isCurrentPage?: boolean
}

function MachineProviderBreadcrumb({ machineProviderId, isCurrentPage }: MachineProviderBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

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
  machineId: string
  isCurrentPage?: boolean
}

function MachineBreadcrumb({ machineId, isCurrentPage }: MachineBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

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

interface NetworksBreadcrumbProps {
  isCurrentPage?: boolean
}

function NetworksBreadcrumb({ isCurrentPage }: NetworksBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/networks`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Networks</span>
    </BreadcrumbElement>
  )
}

interface NetworkBreadcrumbProps {
  networkId: string
  isCurrentPage?: boolean
}

function NetworkBreadcrumb({ networkId, isCurrentPage }: NetworkBreadcrumbProps) {
  const navigate = useNavigate()
  const client = useDboxedQueryClient()
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
  boxId: string
  isCurrentPage?: boolean
}

function BoxBreadcrumb({ boxId, isCurrentPage }: BoxBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

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

interface VolumeProvidersBreadcrumbProps {
  isCurrentPage?: boolean
}

function VolumeProvidersBreadcrumb({ isCurrentPage }: VolumeProvidersBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/volume-providers`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Volume Providers</span>
    </BreadcrumbElement>
  )
}

interface VolumeProviderBreadcrumbProps {
  volumeProviderId: string
  isCurrentPage?: boolean
}

function VolumeProviderBreadcrumb({ volumeProviderId, isCurrentPage }: VolumeProviderBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const volumeProvider = client.useQuery('get', '/v1/workspaces/{workspaceId}/volume-providers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: volumeProviderId
      }
    },
  }, {
    enabled: !!workspaceId && !!volumeProviderId
  })

  const href = `/workspaces/${workspaceId}/volume-providers/${volumeProviderId}`
  const label = volumeProvider.data?.name || 'Volume Provider'

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

interface VolumesBreadcrumbProps {
  isCurrentPage?: boolean
}

function VolumesBreadcrumb({ isCurrentPage }: VolumesBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/volumes`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Volumes</span>
    </BreadcrumbElement>
  )
}

interface VolumeBreadcrumbProps {
  volumeId: string
  isCurrentPage?: boolean
}

function VolumeBreadcrumb({ volumeId, isCurrentPage }: VolumeBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const volume = client.useQuery('get', '/v1/workspaces/{workspaceId}/volumes/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: volumeId
      }
    },
  }, {
    enabled: !!workspaceId && !!volumeId
  })

  const href = `/workspaces/${workspaceId}/volumes/${volumeId}`
  const label = volume.data?.name || 'Volume'

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

interface S3BucketsBreadcrumbProps {
  isCurrentPage?: boolean
}

function S3BucketsBreadcrumb({ isCurrentPage }: S3BucketsBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/s3-buckets`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>S3 Buckets</span>
    </BreadcrumbElement>
  )
}

interface S3BucketBreadcrumbProps {
  s3BucketId: string
  isCurrentPage?: boolean
}

function S3BucketBreadcrumb({ s3BucketId, isCurrentPage }: S3BucketBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const s3Bucket = client.useQuery('get', '/v1/workspaces/{workspaceId}/s3-buckets/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: s3BucketId
      }
    },
  }, {
    enabled: !!workspaceId && !!s3BucketId
  })

  const href = `/workspaces/${workspaceId}/s3-buckets/${s3BucketId}`
  const label = s3Bucket.data?.bucket || 'S3 Bucket'

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

interface LoadBalancersBreadcrumbProps {
  isCurrentPage?: boolean
}

function LoadBalancersBreadcrumb({ isCurrentPage }: LoadBalancersBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const href = `/workspaces/${workspaceId}/load-balancers`

  return (
    <BreadcrumbElement
      href={href}
      isCurrentPage={isCurrentPage}
      onClick={() => navigate(href)}
    >
      <span>Load Balancers</span>
    </BreadcrumbElement>
  )
}

interface LoadBalancerBreadcrumbProps {
  loadBalancerId: string
  isCurrentPage?: boolean
}

function LoadBalancerBreadcrumb({ loadBalancerId, isCurrentPage }: LoadBalancerBreadcrumbProps) {
  const navigate = useNavigate()
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const loadBalancer = client.useQuery('get', '/v1/workspaces/{workspaceId}/load-balancers/{id}', {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: loadBalancerId
      }
    },
  }, {
    enabled: !!workspaceId && !!loadBalancerId
  })

  const href = `/workspaces/${workspaceId}/load-balancers/${loadBalancerId}`
  const label = loadBalancer.data?.name || 'Load Balancer'

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

interface DboxedBreadcrumbsProps {
  className?: string
}

export function DboxedBreadcrumbs({ className }: DboxedBreadcrumbsProps) {
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
    if (machineProviderIdSegment && machineProviderIdSegment.match(/^[^/]+$/)) {
      const machineProviderId = machineProviderIdSegment
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
    if (machineIdSegment && machineIdSegment.match(/^[^/]+$/)) {
      const machineId = machineIdSegment
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
        <NetworksBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific network ID
    const networkIdSegment = pathSegments[currentIndex]
    if (networkIdSegment && networkIdSegment.match(/^[^/]+$/)) {
      const networkId = networkIdSegment
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
    if (boxIdSegment && boxIdSegment.match(/^[^/]+$/)) {
      const boxId = boxIdSegment
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

  // Handle volume-providers path
  if (pathSegments[currentIndex] === 'volume-providers') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-volume-providers"/>,
      <BreadcrumbItem key="volume-providers">
        <VolumeProvidersBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific volume provider ID
    const volumeProviderIdSegment = pathSegments[currentIndex]
    if (volumeProviderIdSegment && volumeProviderIdSegment.match(/^[^/]+$/)) {
      const volumeProviderId = volumeProviderIdSegment
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-volume-providers"/>,
        <BreadcrumbItem key="volume-provider">
          <VolumeProviderBreadcrumb
            volumeProviderId={volumeProviderId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-volume-provider"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle volumes path
  if (pathSegments[currentIndex] === 'volumes') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-volumes"/>,
      <BreadcrumbItem key="volumes">
        <VolumesBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific volume ID
    const volumeIdSegment = pathSegments[currentIndex]
    if (volumeIdSegment && volumeIdSegment.match(/^[^/]+$/)) {
      const volumeId = volumeIdSegment
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-volumes"/>,
        <BreadcrumbItem key="volume">
          <VolumeBreadcrumb
            volumeId={volumeId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-volume"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle s3-buckets path
  if (pathSegments[currentIndex] === 's3-buckets') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-s3-buckets"/>,
      <BreadcrumbItem key="s3-buckets">
        <S3BucketsBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific S3 bucket ID
    const s3BucketIdSegment = pathSegments[currentIndex]
    if (s3BucketIdSegment && s3BucketIdSegment.match(/^[^/]+$/)) {
      const s3BucketId = s3BucketIdSegment
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-s3-buckets"/>,
        <BreadcrumbItem key="s3-bucket">
          <S3BucketBreadcrumb
            s3BucketId={s3BucketId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-s3-bucket"/>,
        <BreadcrumbItem key="create">
          <CreateBreadcrumb isCurrentPage={true}/>
        </BreadcrumbItem>
      )
    }
  }

  // Handle load-balancers path
  if (pathSegments[currentIndex] === 'load-balancers') {
    const isCurrentPage = pathSegments.length === currentIndex + 1

    breadcrumbElements.push(
      <BreadcrumbSeparator key="sep-workspace-load-balancers"/>,
      <BreadcrumbItem key="load-balancers">
        <LoadBalancersBreadcrumb isCurrentPage={isCurrentPage}/>
      </BreadcrumbItem>
    )

    currentIndex++

    // Handle specific load balancer ID
    const loadBalancerIdSegment = pathSegments[currentIndex]
    if (loadBalancerIdSegment && loadBalancerIdSegment.match(/^[^/]+$/)) {
      const loadBalancerId = loadBalancerIdSegment
      const isCurrentPage = pathSegments.length === currentIndex + 1

      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-load-balancers"/>,
        <BreadcrumbItem key="load-balancer">
          <LoadBalancerBreadcrumb
            loadBalancerId={loadBalancerId}
            isCurrentPage={isCurrentPage}
          />
        </BreadcrumbItem>
      )

      currentIndex++
    }

    // Handle create path
    if (pathSegments[currentIndex] === 'create') {
      breadcrumbElements.push(
        <BreadcrumbSeparator key="sep-create-load-balancer"/>,
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