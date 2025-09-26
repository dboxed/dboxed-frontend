import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Network } from "lucide-react"
import type { UseFormReturn } from "react-hook-form";

interface NetbirdConfigFormProps {
  form: UseFormReturn<any>
}

export function NetbirdConfigForm({ form }: NetbirdConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-5 w-5" />
          <span>Netbird Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your Netbird network settings and API access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="netbird.netbirdVersion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Netbird Version *</FormLabel>
              <FormControl>
                <Input
                  placeholder="latest"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The version of Netbird to use for this network (e.g., latest or v0.24.0).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netbird.apiUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://api.netbird.io"
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The Netbird API URL. Leave empty to use the default Netbird cloud service.
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
                />
              </FormControl>
              <FormDescription>
                Your Netbird API access token for authentication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 