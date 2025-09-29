import { useState } from "react"
import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/schema"
import { BoxSelector } from "./BoxSelector.tsx"
import { Copy, Key } from "lucide-react"
import { toast } from "sonner"

interface CreateTokenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTokenDialog({ open, onOpenChange }: CreateTokenDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()
  const [createdToken, setCreatedToken] = useState<components["schemas"]["Token"] | null>(null)

  const handleCreateSuccess = (token: components["schemas"]["Token"]) => {
    setCreatedToken(token)
    return false
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setCreatedToken(null)
    }
    onOpenChange(open)
  }

  const handleCopyToken = async () => {
    if (!createdToken?.token) return

    try {
      await navigator.clipboard.writeText(createdToken.token)
      toast.success("Token copied to clipboard!")
    } catch {
      toast.error("Failed to copy token to clipboard")
    }
  }

  if (createdToken) {
    return (
      <SimpleFormDialog<{}>
        open={open}
        onOpenChange={handleClose}
        title="Token Created Successfully"
        buildInitial={() => ({})}
        onSave={async () => {
          handleClose(false)
          return true
        }}
        saveText="Done"
        showCancel={false}
      >
        {() => (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Your API Token</span>
              </CardTitle>
              <CardDescription>
                Copy this token now - it will only be shown once for security reasons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Token Value</Label>
                <div className="flex space-x-2">
                  <Input
                    value={createdToken.token || ""}
                    readOnly
                    className="font-mono text-xs"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToken}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Token Name</Label>
                <Input
                  value={createdToken.name}
                  readOnly
                  className="text-sm"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Store this token securely. You won't be able to see it again after closing this dialog.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </SimpleFormDialog>
    )
  }

  return (
    <BaseCreateDialog<components["schemas"]["CreateToken"], components["schemas"]["Token"]>
      open={open}
      onOpenChange={handleClose}
      title="Create Token"
      apiRoute="/v1/workspaces/{workspaceId}/tokens"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        forWorkspace: true
      }}
      onSuccess={handleCreateSuccess}
    >
      {(form) => {
        const forWorkspace = form.watch("forWorkspace")

        return <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter token name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forWorkspace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Scope</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const isWorkspace = value === "true"
                    field.onChange(isWorkspace)
                    if (isWorkspace) {
                      form.setValue("boxId", undefined)
                    }
                  }}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token scope" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Workspace Token</SelectItem>
                    <SelectItem value="false">Box Token</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Workspace tokens have access to all resources, box tokens are scoped to a specific box
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!forWorkspace && (
            <BoxSelector form={form} />
          )}
        </div>
      }}
    </BaseCreateDialog>
  )
}