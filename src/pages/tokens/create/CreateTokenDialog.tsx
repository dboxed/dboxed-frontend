import { useState } from "react"
import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"
import { ResourceSelector } from "@/components/ResourceSelector.tsx"
import { TokenSecretDialog } from "@/pages/tokens/create/TokenSecretDialog.tsx";

interface CreateTokenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTokenDialog({ open, onOpenChange }: CreateTokenDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [createdToken, setCreatedToken] = useState<components["schemas"]["Token"] | null>(null)
  const [createdTokenDialog, setCreatedTokenDialog] = useState(false)

  const handleCreateSuccess = (token: components["schemas"]["Token"]) => {
    setCreatedToken(token)
    setCreatedTokenDialog(true)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setCreatedToken(null)
      setCreatedTokenDialog(false)
    }
  }

  return <>
    <TokenSecretDialog open={createdTokenDialog} onOpenChange={handleClose} createdToken={createdToken}/>
    <BaseCreateDialog<components["schemas"]["CreateToken"], components["schemas"]["CreateToken"], components["schemas"]["Token"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Token"
      apiRoute="/v1/workspaces/{workspaceId}/tokens"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        type: "workspace"
      }}
      onSuccess={handleCreateSuccess}
    >
      {(form) => {
        const type = form.watch("type")

        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter token name" autoCapitalize={"off"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Scope</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="workspace">Workspace Token</SelectItem>
                    <SelectItem value="box">Box Token</SelectItem>
                    <SelectItem value="machine">Machine Token</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Workspace tokens have access to all resources, box tokens are scoped to a specific box
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "box" && (
            <FormField
              control={form.control}
              name="boxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Box</FormLabel>
                  <FormControl>
                    <ResourceSelector
                      resourcePath="/v1/workspaces/{workspaceId}/boxes"
                      apiParams={{
                        path: {
                          workspaceId: workspaceId,
                        }
                      }}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder="Select a box"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {type === "machine" && (
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine</FormLabel>
                  <FormControl>
                    <ResourceSelector
                      resourcePath="/v1/workspaces/{workspaceId}/machines"
                      apiParams={{
                        path: {
                          workspaceId: workspaceId,
                        }
                      }}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder="Select a machine"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      }}
    </BaseCreateDialog>
  </>
}