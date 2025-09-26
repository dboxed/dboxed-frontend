import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LabelAndValue } from "@/components/LabelAndValue.tsx"
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
    return await save({
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
        <LabelAndValue
          label="Storage Type"
          textValue={volumeProvider.rustic.storageType}
        />

        <LabelAndValue
          label={"Password"}
          value={
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
        }
        />
      </CardContent>

      <SimpleInputDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        title="Update Rustic Password"
        fieldLabel="New Password"
        placeholder="Enter new password"
        onSave={handlePasswordUpdate}
      />
    </Card>
  )
}