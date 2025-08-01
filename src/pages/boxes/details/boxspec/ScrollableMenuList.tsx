interface ScrollableMenuListProps {
  children: React.ReactNode
  maxHeight?: string
  emptyMessage?: string
  isEmpty?: boolean
}

export function ScrollableMenuList({ 
  children, 
  maxHeight = "max-h-80", 
  emptyMessage = "No items",
  isEmpty = false 
}: ScrollableMenuListProps) {
  return (
    <div className={`${maxHeight} overflow-y-auto space-y-1`}>
      {isEmpty ? (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        children
      )}
    </div>
  )
}