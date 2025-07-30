import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import { useState } from "react"
import { toast } from "sonner"
import { Copy, Key, RefreshCw } from "lucide-react"

interface BoxTokenCardProps {
  boxId: number
  workspaceId: number
}

export function BoxConnectCard({ boxId, workspaceId }: BoxTokenCardProps) {
  const client = useUnboxedQueryClient()
  const [token, setToken] = useState<string>("")

  const tokenMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/regenerate-token')

  const handleGenerateToken = () => {
    tokenMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId,
          id: boxId,
        }
      }
    }, {
      onSuccess: (responseData) => {
        setToken(responseData.token)
        toast.success("Box token generated successfully!")
      },
      onError: (error) => {
        toast.error("Failed to generate box token", {
          description: error.detail || "An error occurred while generating the token."
        })
      }
    })
  }

  const handleCopyToken = async () => {
    if (!token) return
    
    try {
      await navigator.clipboard.writeText(token)
      toast.success("Token copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy token to clipboard")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Generate Spec Url</span>
        </CardTitle>
        <CardDescription>
          Generate a Spec Url that can be used with the unboxed CLI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerateToken}
              disabled={tokenMutation.isPending}
              variant="outline"
              type={"button"}
            >
              {tokenMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {token && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Token</label>
            <div className="flex space-x-2">
              <Input
                value={token}
                readOnly
                className="font-mono text-xs"
                placeholder="Token will appear here..."
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToken}
                type={"button"}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ This token will only be shown once. Copy it now and store it securely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 