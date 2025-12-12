import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { SimpleInputDialog } from "@/components/SimpleInputDialog.tsx"
import { useEditDialogOpenState } from "@/hooks/use-edit-dialog-open-state.ts"
import type { components } from "@/api/models/dboxed-schema"
import { LabelAndValue } from "@/components/LabelAndValue.tsx";

interface SshConfigCardProps {
  data: components["schemas"]["MachineProvider"]
  save: (data: components["schemas"]["UpdateMachineProvider"]) => Promise<boolean>
}

export function SshConfigCard({ data, save }: SshConfigCardProps) {
  const editDialog = useEditDialogOpenState()
  const handleSave = async (value: string) => {
    return await save({
      sshKeyPublic: value
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>SSH Configuration</CardTitle>
            <CardDescription>
              SSH key configuration for the machine provider.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editDialog.setOpen(true)}
          >
            Edit SSH Key
          </Button>
        </CardHeader>
        <CardContent>
          <LabelAndValue label={"SSH Key Fingerprint"} value={data.sshKeyFingerprint || "N/A"}/>
        </CardContent>
      </Card>
      <SimpleInputDialog
        {...editDialog.dialogProps}
        title="Edit SSH Configuration"
        fieldLabel="SSH Public Key"
        placeholder="Enter SSH public key"
        defaultValue={""}
        onSave={handleSave}
      />
    </>
  )
}