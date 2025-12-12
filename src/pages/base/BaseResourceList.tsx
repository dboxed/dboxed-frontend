import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { Plus } from "lucide-react"
import { useDboxedQueryClient } from "@/api/client.ts"
import { DataTable } from "@/components/data-table.tsx"
import type { ColumnDef } from "@tanstack/react-table"
import type { paths } from "@/api/models/dboxed-schema"
import type { FieldValues } from "react-hook-form"
import { type ComponentType } from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip.tsx"
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts";

export interface BaseResourceListProps<TData extends FieldValues> {
  title: string
  resourcePath: keyof paths
  createPath?: string
  columns: ColumnDef<TData>[]
  apiParams?: Record<string, unknown>
  createButton?: React.ReactNode
  createDialog?: ComponentType<{ open: boolean, onOpenChange: (open: boolean) => void }>
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

export function BaseResourceList<TData extends FieldValues>({
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
}: BaseResourceListProps<TData>) {
  const client = useDboxedQueryClient()
  const navigate = useNavigate()

  const createDialogState = useEditDialogOpenState()

  const query = client.useQuery('get', resourcePath as any, {
    params: Object.keys(apiParams).length > 0 ? { ...apiParams } : undefined
  }, {
    refetchInterval: refreshInterval,
  })

  const handleCreateClick = () => {
    if (createPath) {
      navigate(createPath)
    } else {
      createDialogState.setOpen(true)
    }
  }

  const shouldShowCreateButton = !!(showCreateButton && !hideCreateButton && (createButton || createDialog || createPath))
  const CreateDialog = createDialog

  let actualCreateButton = createButton
  if (shouldShowCreateButton && !actualCreateButton) {
    const buttonContent = () => (
      <Button
        disabled={!allowCreate}
        onClick={handleCreateClick}
      >
        <Plus className="mr-2 h-4 w-4"/>
        {createButtonText}
      </Button>
    )

    if (CreateDialog) {
      actualCreateButton = !allowCreate && createDisabledMessage ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent()}
          </TooltipTrigger>
          <TooltipContent>
            {createDisabledMessage}
          </TooltipContent>
        </Tooltip>
      ) : buttonContent()
    } else if (createPath) {
      actualCreateButton = !allowCreate && createDisabledMessage ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {buttonContent()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {createDisabledMessage}
          </TooltipContent>
        </Tooltip>
      ) : buttonContent()
    }
  }

  if (query.isLoading) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {actualCreateButton}
        </div>
        <div className="text-muted-foreground">{loadingMessage}</div>
      </>
    )
  }

  if (query.error) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {actualCreateButton}
        </div>
        <div className="text-red-600">{errorMessage}</div>
      </>
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

  return <>
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
    {CreateDialog && <CreateDialog open={createDialogState.open} onOpenChange={createDialogState.setOpen} />}
  </>
}
