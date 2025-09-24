import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import type { components } from "@/api/models/schema"

interface RusticDetailsCardProps {
  volumeProvider: components["schemas"]["VolumeProvider"]
  save: (newBox: components["schemas"]["UpdateVolumeProvider"]) => Promise<boolean>
}

export function RusticDetailsCard({ volumeProvider, save }: RusticDetailsCardProps) {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  if (!volumeProvider.rustic) {
    return <div>Invalid volume provider</div>
  }

  const handlePasswordUpdate = async (newPassword: string) => {
    await save({
      rustic: {
        password: newPassword
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rustic Configuration</CardTitle>
        <CardDescription>
          Rustic volume provider configuration settings. Sensitive credentials are not displayed for security reasons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Storage Type</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {volumeProvider.rustic.storageType}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              value="••••••••"
              readOnly
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Update
            </Button>
          </div>
        </div>

      </CardContent>

      <SimpleInputDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        title="Update Rustic Password"
        fieldLabel="New Password"
        placeholder="Enter new password"
        onOk={handlePasswordUpdate}
      />
    </Card>
  )
}