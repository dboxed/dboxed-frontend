import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Label } from "@/components/ui/label.tsx"
import { SimpleFormDialog } from "@/components/SimpleFormDialog.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Network } from "lucide-react"
import type { components } from "@/api/models/schema"

interface NetbirdFormData {
  netbirdVersion: string
  apiAccessToken: string
}

interface NetbirdEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  netbirdData: components["schemas"]["NetworkNetbird"]
  save: (update: components["schemas"]["UpdateNetwork"]) => Promise<boolean>
}

function NetbirdEditDialog({ open, onOpenChange, netbirdData, save }: NetbirdEditDialogProps) {
  const buildInitial = (): NetbirdFormData => ({
    netbirdVersion: netbirdData.netbirdVersion,
    apiAccessToken: "",
  })

  const handleSave = async (data: NetbirdFormData) => {
    const updateData: components["schemas"]["UpdateNetwork"] = {
      netbird: {
        netbirdVersion: data.netbirdVersion || undefined,
        apiAccessToken: data.apiAccessToken || undefined,
      },
    }

    const success = await save(updateData)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <SimpleFormDialog<NetbirdFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Netbird Configuration"
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText="Save Changes"
    >
      {(form) => (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="netbirdVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netbird Version</FormLabel>
                <FormControl>
                  <Input
                    placeholder="v0.24.0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The version of Netbird to use for this network (e.g., v0.24.0). Leave empty to keep current version.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiAccessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Access Token</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new API access token (leave blank to keep current)"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your Netbird API access token for authentication. Required for private Netbird instances.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </SimpleFormDialog>
  )
}

interface NetbirdDetailsCardProps {
  netbirdData: components["schemas"]["NetworkNetbird"]
  save: (newBox: components["schemas"]["UpdateNetwork"]) => Promise<boolean>
}

export function NetbirdDetailsCard({ netbirdData, save }: NetbirdDetailsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Netbird Configuration</span>
            </CardTitle>
            <CardDescription>
              Netbird network configuration details.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>API URL</Label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {netbirdData.apiUrl || "Default Netbird Cloud Service"}
          </p>
        </div>

        <div>
          <Label>Netbird Version</Label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {netbirdData.netbirdVersion || "Not specified"}
          </p>
        </div>

        <div>
          <Label>API Token</Label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            ••••••••••••••••
          </p>
        </div>
      </CardContent>

      <NetbirdEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        netbirdData={netbirdData}
        save={save}
      />
    </Card>
  )
} 