import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Package } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import type { components } from "@/api/models/schema"

interface BoxSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateMachine"]>
}

export function BoxSelector({ form }: BoxSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useUnboxedQueryClient()

  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const boxes = boxesQuery.data?.items || []

  const handleBoxChange = (boxId: string) => {
    const selectedBox = boxes.find((box: components["schemas"]["Box"]) =>
      box.id.toString() === boxId
    )
    
    if (selectedBox) {
      form.setValue('box', selectedBox.id)
    }
  }

  if (boxesQuery.isLoading) {
    return (
      <FormItem>
        <FormLabel>Box</FormLabel>
        <div className="text-sm text-muted-foreground">Loading boxes...</div>
      </FormItem>
    )
  }

  if (boxes.length === 0) {
    return (
      <FormItem>
        <FormLabel>Box</FormLabel>
        <div className="text-sm text-muted-foreground">
          No boxes found. Please create a box first.
        </div>
      </FormItem>
    )
  }

  return (
    <FormField
      control={form.control}
      name="box"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Box</FormLabel>
          <FormControl>
            <Select onValueChange={handleBoxChange} defaultValue={field.value?.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select a box" />
              </SelectTrigger>
              <SelectContent>
                {boxes.map((box: components["schemas"]["Box"]) => (
                  <SelectItem key={box.id} value={box.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>{box.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 