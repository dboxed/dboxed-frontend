import { type ComponentType, type ReactElement, type ReactNode } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { ArrowRight, Plus } from "lucide-react"

interface WorkspaceOverviewCardProps {
  icon: ReactNode
  title: string
  description: string
  count: number
  isLoading: boolean
  error: boolean
  items: Array<{
    id: string | number
    content: ReactNode
  }>
  addNewDialog?: ComponentType<{ trigger: ReactElement }>
  emptyState: {
    message: string
    createButtonText: string
    isCreateDisabled?: boolean
    createDisabledMessage?: string
  }
  actions: {
    viewAllText: string
    onViewAllClick: () => void
    addNewText: string
    isAddNewDisabled?: boolean
  }
}

export function WorkspaceOverviewCard({
  icon,
  title,
  description,
  count,
  isLoading,
  error,
  items,
  addNewDialog,
  emptyState,
  actions,
}: WorkspaceOverviewCardProps) {

  const AddNewDialog = addNewDialog

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {count}
          </Badge>
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 space-y-4">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading {title.toLowerCase()}...</div>
          )}

          {error && (
            <div className="text-sm text-red-600">Failed to load {title.toLowerCase()}</div>
          )}

          {!isLoading && !error && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-sm text-muted-foreground mb-4">
                    {emptyState.message}
                  </div>
                  {AddNewDialog && <AddNewDialog trigger={
                    <Button
                      size="sm"
                      disabled={emptyState.isCreateDisabled}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {emptyState.createButtonText}
                    </Button>
                  }/>}
                  {emptyState.isCreateDisabled && emptyState.createDisabledMessage && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {emptyState.createDisabledMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent {title}</div>
                  {items.slice(0, 2).map((item) => (
                    <div key={item.id}>
                      {item.content}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action buttons - shown only when there are items */}
        {!isLoading && !error && items.length > 0 && (
          <div className="flex gap-2 pt-4 mt-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={actions.onViewAllClick}
              className="flex-1"
            >
              {actions.viewAllText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            {AddNewDialog && <AddNewDialog trigger={
              <Button
                size="sm"
                disabled={actions.isAddNewDisabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                {actions.addNewText}
              </Button>
            }/>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}