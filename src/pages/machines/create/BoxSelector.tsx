import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Package } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { ReferenceLabel } from "@/components/ReferenceLabel.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { useMemo } from "react"

interface BoxSelectorProps {
  form: UseFormReturn<components["schemas"]["CreateMachine"]>
}

export function BoxSelector({ form }: BoxSelectorProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const machinesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/machines', {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const boxes = boxesQuery.data?.items || []
  const machines = machinesQuery.data?.items || []

  // Create a map of boxId -> machine for quick lookup
  const boxToMachineMap = useMemo(() => {
    const map = new Map<string, components["schemas"]["Machine"]>()
    machines.forEach(machine => {
      map.set(machine.box, machine)
    })
    return map
  }, [machines])

  // Sort boxes: free boxes first, then used boxes
  const sortedBoxes = useMemo(() => {
    return [...boxes].sort((a, b) => {
      const aHasMachine = boxToMachineMap.has(a.id)
      const bHasMachine = boxToMachineMap.has(b.id)
      
      // Free boxes (no machine) come first
      if (!aHasMachine && bHasMachine) return -1
      if (aHasMachine && !bHasMachine) return 1
      
      // If both are free or both are used, sort by name
      return a.name.localeCompare(b.name)
    })
  }, [boxes, boxToMachineMap])

  const handleBoxChange = (boxId: string) => {
    const selectedBox = boxes.find((box: components["schemas"]["Box"]) =>
      box.id.toString() === boxId
    )
    
    if (selectedBox) {
      form.setValue('box', selectedBox.id)
    }
  }

  if (boxesQuery.isLoading || machinesQuery.isLoading) {
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
                {sortedBoxes.map((box: components["schemas"]["Box"]) => {
                  const usingMachine = boxToMachineMap.get(box.id)
                  const isFree = !usingMachine
                  
                  return (
                    <SelectItem 
                      key={box.id} 
                      value={box.id.toString()}
                      disabled={!isFree}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <span className={isFree ? "" : "text-muted-foreground"}>
                            {box.name}
                          </span>
                          {!isFree && (
                            <span className="text-xs text-muted-foreground">
                              (used)
                            </span>
                          )}
                        </div>
                        {!isFree && usingMachine && (
                          <div className="ml-2 text-xs">
                            <ReferenceLabel
                              resourceId={usingMachine.id}
                              resourcePath="/v1/workspaces/{workspaceId}/machines/{id}"
                              pathParams={{
                                workspaceId: workspaceId!,
                                id: usingMachine.id
                              }}
                              detailsUrl={`/workspaces/${workspaceId}/machines/${usingMachine.id}`}
                              fallbackLabel="Machine"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            />
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 