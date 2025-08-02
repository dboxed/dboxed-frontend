import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useUnboxedQueryClient } from "@/api/api"
import { useState } from "react"
import { toast } from "sonner"
import { Copy, Key, RefreshCw } from "lucide-react"
import { envVars } from "@/env.ts"

interface BoxTokenCardProps {
  boxId: number
  workspaceId: number
}

export function BoxConnectCard({ boxId, workspaceId }: BoxTokenCardProps) {
  const client = useUnboxedQueryClient()
  const [specUrl, setSpecUrl] = useState<string>("")

  const tokenMutation = client.useMutation('post', '/v1/workspaces/{workspaceId}/boxes/{id}/generate-token')

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
        const generatedToken = responseData.token

        // Construct the spec URL with the token as a query parameter
        const baseUrl = envVars.VITE_API_URL.replace(/\/+$/, '') // Remove trailing slashes
        const url = `${baseUrl}/v1/box-spec?token=${encodeURIComponent(generatedToken)}`
        setSpecUrl(url)
        
        toast.success("Box spec URL generated successfully!")
      },
      onError: (error) => {
        toast.error("Failed to generate box token", {
          description: error.detail || "An error occurred while generating the token."
        })
      }
    })
  }

  const handleCopyUrl = async () => {
    if (!specUrl) return
    
    try {
      await navigator.clipboard.writeText(specUrl)
      toast.success("Spec URL copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy URL to clipboard")
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

        {specUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Spec URL</label>
            <div className="flex space-x-2">
              <Input
                value={specUrl}
                readOnly
                className="font-mono text-xs"
                placeholder="URL will appear here..."
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                type={"button"}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ This URL contains a token that will only be shown once. Copy it now and store it securely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 