import { type ReactNode } from "react"
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
    name: string
    onClick: () => void
    badges?: Array<{ text: string; variant?: "default" | "secondary" | "outline" | "destructive" }>
    subtitle?: string
    statusBadge?: { text: string; variant?: "default" | "secondary" | "outline" | "destructive" }
  }>
  emptyState: {
    message: string
    createButtonText: string
    onCreateClick: () => void
    isCreateDisabled?: boolean
    createDisabledMessage?: string
  }
  actions: {
    viewAllText: string
    onViewAllClick: () => void
    addNewText: string
    onAddNewClick: () => void
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
  emptyState,
  actions,
}: WorkspaceOverviewCardProps) {
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
                  <Button 
                    onClick={emptyState.onCreateClick}
                    size="sm"
                    disabled={emptyState.isCreateDisabled}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {emptyState.createButtonText}
                  </Button>
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
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={item.onClick}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{item.name}</div>
                        {item.badges?.map((badge, index) => (
                          <Badge 
                            key={index} 
                            variant={badge.variant || "outline"} 
                            className="text-xs capitalize"
                          >
                            {badge.text}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.statusBadge && (
                          <Badge 
                            variant={item.statusBadge.variant || "outline"} 
                            className="text-xs capitalize"
                          >
                            {item.statusBadge.text}
                          </Badge>
                        )}
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
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
            <Button 
              size="sm"
              onClick={actions.onAddNewClick}
              disabled={actions.isAddNewDisabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              {actions.addNewText}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}