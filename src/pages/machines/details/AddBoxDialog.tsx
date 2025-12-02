import { useState, useMemo } from "react"
import { Package } from "lucide-react"
import { useDboxedQueryClient } from "@/api/client.ts"
import { useDboxedMutation } from "@/api/mutation.ts"
import { SimpleDialog } from "@/components/SimpleDialog.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"

interface AddBoxDialogProps {
  trigger: React.ReactNode
  machineId: string
  workspaceId: string
}

export function AddBoxDialog({ trigger, machineId, workspaceId }: AddBoxDialogProps) {
  const [selectedBoxId, setSelectedBoxId] = useState<string>("")

  const client = useDboxedQueryClient()

  const boxesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/boxes', {
    params: {
      path: {
        workspaceId: workspaceId,
      }
    }
  })

  const addBoxMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/machines/{id}/boxes', {
    successMessage: "Box added to machine",
    errorMessage: "Failed to add box to machine",
    refetchPath: "/v1/workspaces/{workspaceId}/machines/{id}/boxes",
    onSuccess: () => setSelectedBoxId(""),
  })

  const boxes = boxesQuery.data?.items || []

  // Get IDs of boxes already assigned to any machine
  const assignedBoxIds = useMemo(() => {
    const ids = new Set<string>()
    // Filter boxes that have a machine assigned
    boxes.forEach(box => {
      if (box.machine) {
        ids.add(box.id)
      }
    })
    return ids
  }, [boxes])

  // Filter to only show unassigned boxes
  const availableBoxes = useMemo(() => {
    return boxes.filter(box => !assignedBoxIds.has(box.id))
  }, [boxes, assignedBoxIds])

  const handleSave = async () => {
    if (!selectedBoxId) return false

    return await addBoxMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId,
          id: machineId,
        }
      },
      body: {
        boxId: selectedBoxId,
      }
    })
  }

  const isLoading = boxesQuery.isLoading

  return (
    <SimpleDialog
      trigger={trigger}
      title="Add Box to Machine"
      description="Select a box to add to this machine."
      onSave={handleSave}
      saveText="Add Box"
      saveDisabled={!selectedBoxId || availableBoxes.length === 0}
    >
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading boxes...</div>
      ) : availableBoxes.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No available boxes. All boxes are already assigned to machines.
        </div>
      ) : (
        <Select value={selectedBoxId} onValueChange={setSelectedBoxId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a box" />
          </SelectTrigger>
          <SelectContent>
            {availableBoxes.map((box) => (
              <SelectItem key={box.id} value={box.id}>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{box.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </SimpleDialog>
  )
}
