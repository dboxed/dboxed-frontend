import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { components } from "@/api/models/schema"

interface UserAvatarProps {
  user: components["schemas"]["User"]
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8", 
  lg: "h-10 w-10"
}

const fallbackTextClasses = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm"
}

export function UserAvatar({ user, size = "md", className = "" }: UserAvatarProps) {
  // Get initials from name for fallback
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className={fallbackTextClasses[size]}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}