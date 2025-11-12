import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useDboxedQueryClient } from "@/api/api"
import { useState } from "react"
import { toast } from "sonner"
import { Copy, Key, RefreshCw } from "lucide-react"
import { envVars, DEFAULT_API_URL } from "@/env.ts"
import { randomString } from "@/utils/random.ts"
import type { components } from "@/api/models/schema"

interface BoxTokenCardProps {
  box: components["schemas"]["Box"]
}

export function BoxRunCard({ box }: BoxTokenCardProps) {
  const client = useDboxedQueryClient()
  const [cliCommand, setCliCommand] = useState<string>("")

  const createTokenMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/tokens')

  const handleGenerateToken = () => {
    createTokenMutation.mutate({
      params: {
        path: {
          workspaceId: box.workspace,
        }
      },
      body: {
        name: `box_${box.id}_${randomString(8)}`,
        forWorkspace: false,
        boxId: box.id,
      }
    }, {
      onSuccess: (responseData) => {
        if (responseData.token) {
          const generatedToken = responseData.token
          let command = `dboxed sandbox run ${box.name}`

          // Add --api-url if VITE_API_URL_PUBLIC is different from DEFAULT_API_URL
          if (envVars.VITE_API_URL_PUBLIC !== DEFAULT_API_URL) {
            command += ` --api-url ${envVars.VITE_API_URL_PUBLIC}`
          }

          command += ` --api-token ${generatedToken}`

          setCliCommand(command)
          toast.success("CLI command generated successfully!")
        }
      },
      onError: (error) => {
        toast.error("Failed to create box token", {
          description: error.detail || "An error occurred while creating the token."
        })
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
          <Key className="h-5 w-5" />
          <span>Run box</span>
        </CardTitle>
        <CardDescription>
          Generate a CLI command which allows you to run the box.
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
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
                  <Copy className="h-4 w-4" />
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