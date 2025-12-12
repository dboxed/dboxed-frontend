import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedMutation } from "@/api/mutation.ts"
import { toast } from "sonner"

interface AddPortForwardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boxId: string
  onSuccess: () => void
}

interface FormData {
  protocol: string
  sandboxPort: string
  hostPortFirst: string
  hostPortLast: string
  description: string
}

export function AddPortForwardDialog({ open, onOpenChange, boxId, onSuccess }: AddPortForwardDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const createPortForwardMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards', {
    successMessage: "Port forward created successfully!",
    errorMessage: "Failed to create port forward",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards",
    onSuccess: () => onSuccess(),
  })

  const handleSave = async (formData: FormData) => {
    const sandboxPortNum = parseInt(formData.sandboxPort, 10)
    const hostPortFirstNum = parseInt(formData.hostPortFirst, 10)
    const hostPortLastNum = formData.hostPortLast ? parseInt(formData.hostPortLast, 10) : hostPortFirstNum

    if (isNaN(sandboxPortNum) || isNaN(hostPortFirstNum) || isNaN(hostPortLastNum)) {
      toast.error("Invalid port numbers")
      return false
    }

    if (hostPortLastNum < hostPortFirstNum) {
      toast.error("Host port last must be greater than or equal to host port first")
      return false
    }

    return await createPortForwardMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
          id: boxId
        }
      },
      body: {
        protocol: formData.protocol,
        sandboxPort: sandboxPortNum,
        hostPortFirst: hostPortFirstNum,
        hostPortLast: hostPortLastNum,
        description: formData.description || undefined
      }
    })
  }

  return (
    <SimpleFormDialog<FormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Add Port Forward"
      description="Create a new port forwarding rule for this box"
      buildInitial={() => ({
        protocol: "tcp",
        sandboxPort: "",
        hostPortFirst: "",
        hostPortLast: "",
        description: ""
      })}
      onSave={handleSave}
      saveText="Create"
    >
      {(form) => (
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="protocol"
            rules={{ required: "Protocol is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hostPortFirst"
              rules={{
                required: "Host port is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Must be a valid port number"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Port First</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="8080"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostPortLast"
              rules={{
                pattern: {
                  value: /^[0-9]*$/,
                  message: "Must be a valid port number"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Port Last (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
                      placeholder="8080"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sandboxPort"
            rules={{
              required: "Sandbox port is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Must be a valid port number"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sandbox Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="65535"
                    placeholder="8080"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Web server port"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </SimpleFormDialog>
  )
}
