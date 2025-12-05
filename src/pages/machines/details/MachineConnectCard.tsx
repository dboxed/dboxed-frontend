import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useDboxedMutation } from "@/api/mutation.ts"
import { useState } from "react"
import { toast } from "sonner"
import { Copy, Key, RefreshCw } from "lucide-react"
import { envVars, DEFAULT_API_URL } from "@/env.ts"
import { randomString } from "@/utils/random.ts"
import type { components } from "@/api/models/dboxed-schema"

interface MachineConnectCardProps {
  machine: components["schemas"]["Machine"]
}

export function MachineConnectCard({ machine }: MachineConnectCardProps) {
  const [cliCommand, setCliCommand] = useState<string>("")

  const createTokenMutation = useDboxedMutation('post', '/v1/workspaces/{workspaceId}/tokens', {
    successMessage: "CLI command generated successfully!",
    errorMessage: "Failed to create machine token",
    onSuccess: (responseData: { token?: string }) => {
      if (responseData.token) {
        const generatedToken = responseData.token
        let command = `dboxed machine run ${machine.name}`

        // Add --api-url if VITE_API_URL_PUBLIC is different from DEFAULT_API_URL
        if (envVars.VITE_API_URL_PUBLIC !== DEFAULT_API_URL) {
          command += ` --api-url ${envVars.VITE_API_URL_PUBLIC}`
        }

        command += ` --api-token ${generatedToken}`

        setCliCommand(command)
      }
    },
  })

  const handleGenerateToken = () => {
    createTokenMutation.mutateAsync({
      params: {
        path: {
          workspaceId: machine.workspace,
        }
      },
      body: {
        name: `machine_${machine.id}_${randomString(8)}`,
        type: "machine",
        machineId: machine.id,
      }
    })
  }

  const handleCopyCommand = async () => {
    if (!cliCommand) return

    try {
      await navigator.clipboard.writeText(cliCommand)
      toast.success("CLI command copied to clipboard!")
    } catch {
      toast.error("Failed to copy command to clipboard")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5"/>
          <span>Connect to Machine</span>
        </CardTitle>
        <CardDescription>
          Generate a CLI command which allows you to connect to this machine.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerateToken}
              disabled={createTokenMutation.isPending}
              variant="outline"
              type={"button"}
            >
              {createTokenMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                  Creating Token...
                </>
              ) : (
                <>
                  Generate CLI Command
                </>
              )}
            </Button>
          </div>
        </div>

        {cliCommand && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CLI Command</Label>
              <div className="flex space-x-2">
                <Input
                  value={cliCommand}
                  readOnly
                  className="font-mono text-xs"
                  placeholder="Command will appear here..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCommand}
                  type={"button"}
                >
                  <Copy className="h-4 w-4"/>
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              ⚠️ This command contains a newly created token. You can manage tokens from the tokens page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
