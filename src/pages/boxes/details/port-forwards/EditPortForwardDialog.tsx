import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedMutation } from "@/api/mutation.ts"
import type { components } from "@/api/models/dboxed-schema"
import { toast } from "sonner"

interface EditPortForwardDialogProps {
  boxId: string
  portForward: components["schemas"]["BoxPortForward"]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface FormData {
  hostPortFirst: string
  hostPortLast: string
  description: string
}

export function EditPortForwardDialog({ boxId, portForward, open, onOpenChange, onSuccess }: EditPortForwardDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  const updatePortForwardMutation = useDboxedMutation('patch', '/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards/{portForwardId}', {
    successMessage: "Port forward updated successfully!",
    errorMessage: "Failed to update port forward",
    refetchPath: "/v1/workspaces/{workspaceId}/boxes/{id}/port-forwards",
    onSuccess: () => onSuccess(),
  })

  const handleSave = async (formData: FormData) => {
    const hostPortFirstNum = parseInt(formData.hostPortFirst, 10)
    const hostPortLastNum = parseInt(formData.hostPortLast, 10)

    if (isNaN(hostPortFirstNum) || isNaN(hostPortLastNum)) {
      toast.error("Invalid port numbers")
      return false
    }

    if (hostPortLastNum < hostPortFirstNum) {
      toast.error("Host port last must be greater than or equal to host port first")
      return false
    }

    return await updatePortForwardMutation.mutateAsync({
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
        description: formData.description || undefined
      }
    })
  }

  return (
    <SimpleFormDialog<FormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Port Forward"
      description={`Update port forwarding rule (${portForward.protocol}:${portForward.sandboxPort})`}
      buildInitial={() => ({
        hostPortFirst: portForward.hostPortFirst.toString(),
        hostPortLast: portForward.hostPortLast.toString(),
        description: portForward.description || ""
      })}
      onSave={handleSave}
      saveText="Save Changes"
    >
      {(form) => (
        <div className="grid gap-4">
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
                required: "Host port is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Must be a valid port number"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Port Last</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="65535"
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
