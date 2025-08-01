import * as React from "react";

interface MenuItemProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  className?: string
}

export function MenuItem({ onClick, isActive = false, children, className = "" }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      } ${className}`}
    >
      {children}
    </button>
  )
}
