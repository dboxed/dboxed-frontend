import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { toast } from "sonner"

interface AddPortForwardDialogProps {
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddPortForwardDialog({ boxId, open, onOpenChange, onSuccess }: AddPortForwardDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [protocol, setProtocol] = useState<string>("tcp")
  const [sandboxPort, setSandboxPort] = useState<string>("")
  const [hostPortFirst, setHostPortFirst] = useState<string>("")
  const [hostPortLast, setHostPortLast] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const createPortForwardMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sandboxPortNum = parseInt(sandboxPort, 10)
    const hostPortFirstNum = parseInt(hostPortFirst, 10)
    const hostPortLastNum = hostPortLast ? parseInt(hostPortLast, 10) : hostPortFirstNum

    if (isNaN(sandboxPortNum) || isNaN(hostPortFirstNum) || isNaN(hostPortLastNum)) {
      toast.error("Invalid port numbers")
      return
    }

    if (hostPortLastNum < hostPortFirstNum) {
      toast.error("Host port last must be greater than or equal to host port first")
      return
    }

    createPortForwardMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        protocol,
        sandboxPort: sandboxPortNum,
        hostPortFirst: hostPortFirstNum,
        hostPortLast: hostPortLastNum,
        description: description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("Port forward created successfully!")
        onSuccess()
        onOpenChange(false)
        // Reset form
        setProtocol("tcp")
        setSandboxPort("")
        setHostPortFirst("")
        setHostPortLast("")
        setDescription("")
      },
      onError: (error) => {
        toast.error("Failed to create port forward", {
          description: error.detail || "An error occurred while creating the port forward."
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Port Forward</DialogTitle>
            <DialogDescription>
              Create a new port forwarding rule for this box
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="protocol">Protocol</Label>
              <Select value={protocol} onValueChange={setProtocol}>
                <SelectTrigger id="protocol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hostPortFirst">Host Port First</Label>
                <Input
                  id="hostPortFirst"
                  type="number"
                  min="1"
                  max="65535"
                  placeholder="8080"
                  value={hostPortFirst}
                  onChange={(e) => setHostPortFirst(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hostPortLast">Host Port Last (Optional)</Label>
                <Input
                  id="hostPortLast"
                  type="number"
                  min="1"
                  max="65535"
                  placeholder="8080"
                  value={hostPortLast}
                  onChange={(e) => setHostPortLast(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sandboxPort">Sandbox Port</Label>
              <Input
                id="sandboxPort"
                type="number"
                min="1"
                max="65535"
                placeholder="8080"
                value={sandboxPort}
                onChange={(e) => setSandboxPort(e.target.value)}
                required
              />
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
            <Button type="submit" disabled={createPortForwardMutation.isPending}>
              {createPortForwardMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
