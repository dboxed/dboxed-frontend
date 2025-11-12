import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { IngressProxyStatusBadge } from "@/pages/ingress-proxies/IngressProxyStatusBadge.tsx"
import { toast } from "sonner"

interface AddIngressDialogProps {
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddIngressDialog({ boxId, open, onOpenChange, onSuccess }: AddIngressDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [proxyId, setProxyId] = useState<string>("")
  const [hostname, setHostname] = useState<string>("")
  const [pathPrefix, setPathPrefix] = useState<string>("/")
  const [port, setPort] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // Fetch available ingress proxies
  const proxiesQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/ingress-proxies', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  }, {
    enabled: open
  })

  const createIngressMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/ingresses')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const portNum = parseInt(port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return
    }

    if (!proxyId) {
      toast.error("Please select an ingress proxy")
      return
    }

    createIngressMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        proxyId,
        hostname,
        pathPrefix,
        port: portNum,
        description: description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("Ingress created successfully!")
        onSuccess()
        onOpenChange(false)
        // Reset form
        setProxyId("")
        setHostname("")
        setPathPrefix("/")
        setPort("")
        setDescription("")
      },
      onError: (error) => {
        toast.error("Failed to create ingress", {
          description: error.detail || "An error occurred while creating the ingress."
        })
      }
    })
  }

  const proxies = proxiesQuery.data?.items || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Ingress</DialogTitle>
            <DialogDescription>
              Create a new HTTP ingress rule for this box
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="proxyId">Ingress Proxy</Label>
              <Select value={proxyId} onValueChange={setProxyId}>
                <SelectTrigger id="proxyId">
                  <SelectValue placeholder="Select an ingress proxy" />
                </SelectTrigger>
                <SelectContent>
                  {proxies.map((proxy) => (
                    <SelectItem key={proxy.id} value={proxy.id}>
                      <div className="flex items-center gap-2">
                        <span>{proxy.name}</span>
                        <IngressProxyStatusBadge status={proxy.status} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hostname">Hostname</Label>
              <Input
                id="hostname"
                type="text"
                placeholder="example.com"
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
                placeholder="/"
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
                placeholder="8080"
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
            <Button type="submit" disabled={createIngressMutation.isPending}>
              {createIngressMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
