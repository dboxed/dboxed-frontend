import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { components } from "@/api/models/schema"
import { toast } from "sonner"

interface EditPortForwardDialogProps {
  boxId: string
  portForward: components["schemas"]["BoxPortForward"]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditPortForwardDialog({ boxId, portForward, open, onOpenChange, onSuccess }: EditPortForwardDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [hostPortFirst, setHostPortFirst] = useState<string>(portForward.hostPortFirst.toString())
  const [hostPortLast, setHostPortLast] = useState<string>(portForward.hostPortLast.toString())
  const [description, setDescription] = useState<string>(portForward.description || "")

  useEffect(() => {
    setHostPortFirst(portForward.hostPortFirst.toString())
    setHostPortLast(portForward.hostPortLast.toString())
    setDescription(portForward.description || "")
  }, [portForward])

  const updatePortForwardMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards/{portForwardId}')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const hostPortFirstNum = parseInt(hostPortFirst, 10)
    const hostPortLastNum = parseInt(hostPortLast, 10)

    if (isNaN(hostPortFirstNum) || isNaN(hostPortLastNum)) {
      toast.error("Invalid port numbers")
      return
    }

    if (hostPortLastNum < hostPortFirstNum) {
      toast.error("Host port last must be greater than or equal to host port first")
      return
    }

    updatePortForwardMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          portForwardId: portForward.id
        }
      },
      body: {
        hostPortFirst: hostPortFirstNum,
        hostPortLast: hostPortLastNum,
        description: description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("Port forward updated successfully!")
        onSuccess()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error("Failed to update port forward", {
          description: error.detail || "An error occurred while updating the port forward."
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Port Forward</DialogTitle>
            <DialogDescription>
              Update port forwarding rule ({portForward.protocol}:{portForward.sandboxPort})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hostPortFirst">Host Port First</Label>
                <Input
                  id="hostPortFirst"
                  type="number"
                  min="1"
                  max="65535"
                  value={hostPortFirst}
                  onChange={(e) => setHostPortFirst(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hostPortLast">Host Port Last</Label>
                <Input
                  id="hostPortLast"
                  type="number"
                  min="1"
                  max="65535"
                  value={hostPortLast}
                  onChange={(e) => setHostPortLast(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Web server port"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updatePortForwardMutation.isPending}>
              {updatePortForwardMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
