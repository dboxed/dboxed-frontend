import { SimpleFormDialog } from "@/components/SimpleFormDialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Copy, Key } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { components } from "@/api/models/dboxed-schema"
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";


export const TokenSecretDialog = (props: {
  open: boolean,
  onOpenChange: (b: boolean) => void,
  createdToken: components["schemas"]["Token"] | null
}) => {
  const handleCopyToken = async () => {
    if (!props.createdToken?.token) return

    try {
      await navigator.clipboard.writeText(props.createdToken.token)
      toast.success("Token copied to clipboard!")
    } catch {
      toast.error("Failed to copy token to clipboard")
    }
  }

  return <SimpleFormDialog<{}>
    open={props.open}
    onOpenChange={props.onOpenChange}
    title="Token Created Successfully"
    buildInitial={() => ({})}
    onSave={async () => {
      props.onOpenChange(false)
      return true
    }}
    saveText="Done"
    showCancel={false}
  >
    {() => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5"/>
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
                value={props.createdToken?.token || ""}
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
                <Copy className="h-4 w-4"/>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Token Name</Label>
            <Input
              value={props.createdToken?.name}
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
}