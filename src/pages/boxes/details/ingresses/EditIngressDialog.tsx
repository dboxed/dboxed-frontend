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

interface EditIngressDialogProps {
  boxId: string
  ingress: components["schemas"]["BoxIngress"]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditIngressDialog({ boxId, ingress, open, onOpenChange, onSuccess }: EditIngressDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [hostname, setHostname] = useState<string>(ingress.hostname)
  const [pathPrefix, setPathPrefix] = useState<string>(ingress.pathPrefix)
  const [port, setPort] = useState<string>(ingress.port.toString())
  const [description, setDescription] = useState<string>(ingress.description || "")

  useEffect(() => {
    setHostname(ingress.hostname)
    setPathPrefix(ingress.pathPrefix)
    setPort(ingress.port.toString())
    setDescription(ingress.description || "")
  }, [ingress])

  const updateIngressMutation = client.useMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/ingresses/{ingressId}')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const portNum = parseInt(port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return
    }

    updateIngressMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId,
          ingressId: ingress.id
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
        toast.success("Ingress updated successfully!")
        onSuccess()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error("Failed to update ingress", {
          description: error.detail || "An error occurred while updating the ingress."
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Ingress</DialogTitle>
            <DialogDescription>
              Update the HTTP ingress rule for this box
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
                placeholder="Web application ingress"
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
            <Button type="submit" disabled={updateIngressMutation.isPending}>
              {updateIngressMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
