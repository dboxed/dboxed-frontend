import { Button } from "@/components/ui/button"
import { BasePage } from "./BasePage"
import { useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { DataTable } from "@/components/data-table.tsx"
import type { ColumnDef } from "@tanstack/react-table"
import type { paths } from "@/api/models/dboxed-schema"
import type { FieldValues } from "react-hook-form"
import { useState, type ComponentType } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip.tsx"

interface BaseListPageProps<TData extends FieldValues> {
  title: string
  resourcePath: keyof paths
  createPath?: string
  columns: ColumnDef<TData>[]
  apiParams?: Record<string, unknown>
  createButton?: React.ReactNode
  createDialog?: ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>
  createButtonText?: string
  emptyStateMessage?: string
  loadingMessage?: string
  errorMessage?: string
  hideCreateButton?: boolean
  transformData?: (data: any) => TData[]
  showCreateButton?: boolean
  searchColumn?: string
  searchPlaceholder?: string
  allowCreate?: boolean
  createDisabledMessage?: string
  refreshInterval?: number
}

export function BaseListPage<TData extends FieldValues>({
  title,
  resourcePath,
  createPath,
  columns,
  apiParams = {},
  createButton,
  createDialog,
  createButtonText = `Create ${title.slice(0, -1)}`, // Remove 's' from plural title
  emptyStateMessage,
  loadingMessage = `Loading ${title.toLowerCase()}...`,
  errorMessage = `Failed to load ${title.toLowerCase()}`,
  hideCreateButton = false,
  transformData,
  showCreateButton = true,
  searchColumn,
  searchPlaceholder,
  allowCreate = true,
  createDisabledMessage,
  refreshInterval = 5000,
}: BaseListPageProps<TData>) {
  const client = useDboxedQueryClient()
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const query = client.useQuery('get', resourcePath as any, {
    params: Object.keys(apiParams).length > 0 ? { ...apiParams } : undefined
  }, {
    refetchInterval: refreshInterval,
  })

  const handleCreateClick = () => {
    if (createPath) {
      navigate(createPath)
    }
  }

  const shouldShowCreateButton = !!(showCreateButton && !hideCreateButton && (createButton || createDialog || createPath))

  let actualCreateButton = createButton
  if (shouldShowCreateButton && !actualCreateButton) {
    const buttonContent = (onClick: () => void) => (
      <Button
        onClick={onClick}
        disabled={!allowCreate}
      >
        <Plus className="mr-2 h-4 w-4"/>
        {createButtonText}
      </Button>
    )

    if (createDialog) {
      actualCreateButton = !allowCreate && createDisabledMessage ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {buttonContent(() => setIsDialogOpen(true))}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {createDisabledMessage}
          </TooltipContent>
        </Tooltip>
      ) : buttonContent(() => setIsDialogOpen(true))
    } else if (createPath) {
      actualCreateButton = !allowCreate && createDisabledMessage ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {buttonContent(handleCreateClick)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {createDisabledMessage}
          </TooltipContent>
        </Tooltip>
      ) : buttonContent(handleCreateClick)
    }
  }

  const CreateDialog = createDialog

  if (query.isLoading) {
    return (
      <BasePage title={title}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {actualCreateButton}
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
          {actualCreateButton}
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
    `No ${title.toLowerCase()} found yet.${shouldShowCreateButton ? ` Create your first ${title.slice(0, -1).toLowerCase()} to get started.` : ''}`

  return (
    <BasePage title={title}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {actualCreateButton}
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

      {CreateDialog && (
        <CreateDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      )}
    </BasePage>
  )
} 