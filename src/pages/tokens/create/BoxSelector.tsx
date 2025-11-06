import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"
import { useDboxedQueryClient } from "@/api/api.ts"

interface BoxSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateToken"]>
}

export function BoxSelector({ form }: BoxSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const { data } = client.useSuspenseQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const boxes = data.items || []

  return (
    <FormField
      control={form.control}
      name="boxId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Box</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value || undefined)}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a box" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {boxes.map((box) => (
                <SelectItem key={box.id} value={box.id.toString()}>
                  {box.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}