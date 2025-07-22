import { Button } from "@/components/ui/button"
import { BasePage } from "./BasePage"
import { useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { useUnboxedQueryClient } from "@/api/api"
import { DataTable } from "@/components/data-table.tsx"
import type { ColumnDef } from "@tanstack/react-table"
import type { paths } from "@/api/models/schema"

interface BaseListPageProps<TData = any> {
  title: string
  resourcePath: keyof paths
  createPath?: string
  columns: ColumnDef<TData>[]
  apiParams?: Record<string, any>
  createButtonText?: string
  emptyStateMessage?: string
  loadingMessage?: string
  errorMessage?: string
  hideCreateButton?: boolean
  customCreateAction?: () => void
  transformData?: (data: any) => TData[]
  showCreateButton?: boolean
  searchColumn?: string
  searchPlaceholder?: string
}

export function BaseListPage<TData = any>({
  title,
  resourcePath,
  createPath,
  columns,
  apiParams = {},
  createButtonText = `Create ${title.slice(0, -1)}`, // Remove 's' from plural title
  emptyStateMessage,
  loadingMessage = `Loading ${title.toLowerCase()}...`,
  errorMessage = `Failed to load ${title.toLowerCase()}`,
  hideCreateButton = false,
  customCreateAction,
  transformData,
  showCreateButton = true,
  searchColumn,
  searchPlaceholder
}: BaseListPageProps<TData>) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()

  const query = client.useQuery('get', resourcePath as any, {
    params: Object.keys(apiParams).length > 0 ? { ...apiParams } : undefined
  })

  const handleCreateClick = () => {
    if (customCreateAction) {
      customCreateAction()
    } else if (createPath) {
      navigate(createPath)
    }
  }

  const shouldShowCreateButton = showCreateButton && !hideCreateButton && (createPath || customCreateAction)

  if (query.isLoading) {
    return (
      <BasePage title={title}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {shouldShowCreateButton && (
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </div>
        <div className="text-muted-foreground">{loadingMessage}</div>
      </BasePage>
    )
  }

  if (query.error) {
    return (
      <BasePage title={title}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {shouldShowCreateButton && (
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </div>
        <div className="text-red-600">{errorMessage}</div>
      </BasePage>
    )
  }

  // Transform the data if a transformer is provided
  let data: TData[]
  if (transformData) {
    data = transformData(query.data)
  } else {
    // Default transformation - assumes API returns { items: TData[] }
    data = (query.data as any)?.items || (Array.isArray(query.data) ? query.data : [])
  }

  const defaultEmptyMessage = emptyStateMessage || 
    `No ${title.toLowerCase()} found yet.${createPath || customCreateAction ? ` Create your first ${title.slice(0, -1).toLowerCase()} to get started.` : ''}`

  return (
    <BasePage title={title}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {shouldShowCreateButton && (
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            {createButtonText}
          </Button>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="text-muted-foreground">
          {defaultEmptyMessage}
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={data} 
          searchColumn={searchColumn}
          searchPlaceholder={searchPlaceholder}
        />
      )}
    </BasePage>
  )
} 