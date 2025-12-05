import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useDboxedQueryClient } from "@/api/client.ts"
import type { paths } from "@/api/models/dboxed-schema"

interface ResourceSelectorProps<TResource extends { id: string; name: string }> {
  resourcePath: keyof paths
  apiParams?: Record<string, unknown>
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  getLabel?: (item: TResource) => string
  getValue?: (item: TResource) => string
  className?: string
}

export function ResourceSelector<TResource extends { id: string; name: string }>({
  resourcePath,
  apiParams,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  getLabel = (item) => item.name,
  getValue = (item) => item.id,
  className,
}: ResourceSelectorProps<TResource>) {
  const client = useDboxedQueryClient()

  const { data, isLoading } = client.useQuery('get', resourcePath as any, {
    params: apiParams,
  })

  const items = (data as { items?: TResource[] } | undefined)?.items || []

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val || undefined)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={getValue(item)} value={getValue(item)}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
