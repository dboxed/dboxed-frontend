import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { components } from "@/api/models/dboxed-schema"
import { toast } from "sonner"

interface EditLoadBalancerServiceDialogProps {
  boxId: string
  loadBalancerService: components["schemas"]["LoadBalancerService"]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditLoadBalancerServiceDialog({ boxId, loadBalancerService, open, onOpenChange, onSuccess }: EditLoadBalancerServiceDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [hostname, setHostname] = useState<string>(loadBalancerService.hostname)
  const [pathPrefix, setPathPrefix] = useState<string>(loadBalancerService.pathPrefix)
  const [port, setPort] = useState<string>(loadBalancerService.port.toString())
  const [description, setDescription] = useState<string>(loadBalancerService.description || "")

  useEffect(() => {
    setHostname(loadBalancerService.hostname)
    setPathPrefix(loadBalancerService.pathPrefix)
    setPort(loadBalancerService.port.toString())
    setDescription(loadBalancerService.description || "")
  }, [loadBalancerService])

  const updateLoadBalancerServiceMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services/{loadBalancerServiceId}')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const portNum = parseInt(port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return
    }

    updateLoadBalancerServiceMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          loadBalancerServiceId: loadBalancerService.id
        }
      },
      body: {
        hostname,
        pathPrefix,
        port: portNum,
        description: description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("LoadBalancerService updated successfully!")
        onSuccess()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error("Failed to update loadBalancerService", {
          description: error.detail || "An error occurred while updating the loadBalancerService."
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit LoadBalancerService</DialogTitle>
            <DialogDescription>
              Update the HTTP loadBalancerService rule for this box
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pathPrefix">Path Prefix</Label>
              <Input
                id="pathPrefix"
                type="text"
                value={pathPrefix}
                onChange={(e) => setPathPrefix(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                min="1"
                max="65535"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Web application loadBalancerService"
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
            <Button type="submit" disabled={updateLoadBalancerServiceMutation.isPending}>
              {updateLoadBalancerServiceMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
