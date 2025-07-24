import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Network } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema"

interface NetbirdDetailsCardProps {
  netbirdData: components["schemas"]["NetworkNetbird"]
  form: UseFormReturn<any>
}

export function NetbirdDetailsCard({ netbirdData, form }: NetbirdDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-5 w-5" />
          <span>Netbird Configuration</span>
        </CardTitle>
        <CardDescription>
          Netbird network configuration details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Read-only fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">API URL</label>
            <p className="text-sm text-muted-foreground font-mono">
              {netbirdData.apiUrl || "Default Netbird Cloud Service"}
            </p>
          </div>
        </div>

        {/* Editable fields for UpdateNetwork */}
        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="netbird.netbirdVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netbird Version</FormLabel>
                <FormControl>
                  <Input
                    placeholder="v0.24.0"
                    {...field}
                    value={field.value || ""}
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
            name="netbird.apiAccessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Access Token</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your-netbird-api-token"
                    type="password"
                    {...field}
                    value={field.value || ""}
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
      </CardContent>
    </Card>
  )
} 