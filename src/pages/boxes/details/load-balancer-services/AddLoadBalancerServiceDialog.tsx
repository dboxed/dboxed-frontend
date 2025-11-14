import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import { toast } from "sonner"
import { StatusBadge } from "@/components/StatusBadge.tsx";

interface AddLoadBalancerServiceDialogProps {
  boxId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddLoadBalancerServiceDialog({ boxId, open, onOpenChange, onSuccess }: AddLoadBalancerServiceDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()
  const [loadBalancerId, setLoadBalancerId] = useState<string>("")
  const [hostname, setHostname] = useState<string>("")
  const [pathPrefix, setPathPrefix] = useState<string>("/")
  const [port, setPort] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const lbsQuery = client.useQuery('get', '/v1/workspaces/{workspaceId}/load-balancers', {
    params: {
      path: {
        workspaceId: workspaceId!
      }
    }
  }, {
    enabled: open
  })

  const createLoadBalancerServiceMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/load-balancer-services')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const portNum = parseInt(port, 10)

    if (isNaN(portNum)) {
      toast.error("Invalid port number")
      return
    }

    if (!loadBalancerId) {
      toast.error("Please select an Load Balancer")
      return
    }

    createLoadBalancerServiceMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        loadBalancerId: loadBalancerId,
        hostname,
        pathPrefix,
        port: portNum,
        description: description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("Load Balancer Service created successfully!")
        onSuccess()
        onOpenChange(false)
        // Reset form
        setLoadBalancerId("")
        setHostname("")
        setPathPrefix("/")
        setPort("")
        setDescription("")
      },
      onError: (error) => {
        toast.error("Failed to create Load Balancer Service", {
          description: error.detail || "An error occurred while creating the Load Balancer Service."
        })
      }
    })
  }

  const lbs = lbsQuery.data?.items || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Load Balancer Service</DialogTitle>
            <DialogDescription>
              Create a new HTTP Load Balancer Service rule for this box
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="loadBalancerId">Load Balancer</Label>
              <Select value={loadBalancerId} onValueChange={setLoadBalancerId}>
                <SelectTrigger id="loadBalancerId">
                  <SelectValue placeholder="Select a load balancer" />
                </SelectTrigger>
                <SelectContent>
                  {lbs.map((lb) => (
                    <SelectItem key={lb.id} value={lb.id}>
                      <div className="flex items-center gap-2">
                        <span>{lb.name}</span>
                        <StatusBadge item={lb}/>
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
                placeholder="Web application"
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
            <Button type="submit" disabled={createLoadBalancerServiceMutation.isPending}>
              {createLoadBalancerServiceMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
