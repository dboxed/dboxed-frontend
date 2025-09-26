import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useDboxedQueryClient } from "@/api/api"
import { useState } from "react"
import { toast } from "sonner"
import { Copy, Key, RefreshCw } from "lucide-react"
import { envVars } from "@/env.ts"

interface BoxTokenCardProps {
  boxId: number
  workspaceId: number
  boxUrl: string
}

export function BoxConnectCard({ boxId, workspaceId, boxUrl }: BoxTokenCardProps) {
  const client = useDboxedQueryClient()
  const [natsUrl, setNatsUrl] = useState<string>("")
  const [httpURl, setHttpURl] = useState<string>("")

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

        // Parse the box URL and add the token to existing query parameters
        const url = new URL(boxUrl)
        url.searchParams.set('token', generatedToken)
        setNatsUrl(url.toString())
        
        // Generate http URL
        const apiUrl = new URL('/v1/box-spec', envVars.VITE_API_URL)
        apiUrl.searchParams.set('token', generatedToken)
        setHttpURl(apiUrl.toString())
        
        toast.success("Box spec URL generated successfully!")
      },
      onError: (error) => {
        toast.error("Failed to generate box token", {
          description: error.detail || "An error occurred while generating the token."
        })
      }
    })
  }

  const handleCopyNatsUrl = async () => {
    if (!natsUrl) return
    
    try {
      await navigator.clipboard.writeText(natsUrl)
      toast.success("Nats URL copied to clipboard!")
    } catch {
      toast.error("Failed to copy URL to clipboard")
    }
  }

  const handleCopyHttpUrl = async () => {
    if (!httpURl) return
    
    try {
      await navigator.clipboard.writeText(httpURl)
      toast.success("Http URL copied to clipboard!")
    } catch {
      toast.error("Failed to copy URL to clipboard")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Generate Urls</span>
        </CardTitle>
        <CardDescription>
          Generate a Urls that can be used with the dboxed CLI.
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

        {natsUrl && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nats URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={natsUrl}
                  readOnly
                  className="font-mono text-xs"
                  placeholder="URL will appear here..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNatsUrl}
                  type={"button"}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>HTTP URL</Label>
              <div className="flex space-x-2">
                <Input
                  value={httpURl}
                  readOnly
                  className="font-mono text-xs"
                  placeholder="API endpoint URL will appear here..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyHttpUrl}
                  type={"button"}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              ⚠️ These URLs contain a token that will only be shown once. Copy them now and store them securely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 