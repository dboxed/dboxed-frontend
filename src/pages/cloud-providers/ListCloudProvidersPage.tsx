import { Button } from "@/components/ui/button"
import { BasePage } from "@/pages/base/BasePage.tsx"
import { useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { useUnboxedQueryClient } from "@/api/api.ts";
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

interface ListCloudProvidersPageProps {
  workspaceId: number
}

// Define the CloudProvider type based on the API schema
interface CloudProvider {
  id: number
  name: string
  type: string
  status: string
  created_at: string
  ssh_key_fingerprint: string | null
  workspace: number
}

// Simple Badge component
function Badge({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background"
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function ListCloudProvidersPage(props: ListCloudProvidersPageProps) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()

  const cloudProviders = client.useQuery('get', '/v1/workspaces/{workspaceId}/cloud-providers', {
    params: {
      path: {
        workspaceId: props.workspaceId,
      }
    }
  })

  // Define columns for the DataTable
  const columns: ColumnDef<CloudProvider>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const id = row.original.id
        return (
          <button
            onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/${id}`)}
            className="font-medium text-left hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            {name}
          </button>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const getStatusVariant = (status: string) => {
          switch (status.toLowerCase()) {
            case 'active':
              return 'default'
            case 'pending':
              return 'secondary'
            case 'error':
              return 'destructive'
            default:
              return 'outline'
          }
        }
        return (
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
        return (
          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/${id}`)}
          >
            View Details
          </Button>
        )
      },
    },
  ]

  if (cloudProviders.isLoading) {
    return (
      <BasePage title="Cloud Providers">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cloud Providers</h2>
          <Button onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Cloud Provider
          </Button>
        </div>
        <div className="text-muted-foreground">Loading cloud providers...</div>
      </BasePage>
    )
  }

  if (cloudProviders.error) {
    return (
      <BasePage title="Cloud Providers">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cloud Providers</h2>
          <Button onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Cloud Provider
          </Button>
        </div>
        <div className="text-red-600">Failed to load cloud providers</div>
      </BasePage>
    )
  }

  const data = cloudProviders.data?.items || []

  return (
    <BasePage title="Cloud Providers">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cloud Providers</h2>
        <Button onClick={() => navigate(`/workspaces/${props.workspaceId}/cloud-providers/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Cloud Provider
        </Button>
      </div>
      
      {data.length === 0 ? (
        <div className="text-muted-foreground">
          No cloud providers configured yet. Create your first cloud provider to get started.
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </BasePage>
  )
}
