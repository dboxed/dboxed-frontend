import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Server } from "lucide-react"
import type { UseFormReturn } from "react-hook-form";

interface HetznerConfigFormProps {
  form: UseFormReturn<any>
}

export function HetznerConfigForm({ form }: HetznerConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Hetzner Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure your Hetzner Cloud credentials and network settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="hetzner.cloudToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hetzner Cloud Token</FormLabel>
              <FormControl>
                <Input
                  placeholder="your-hetzner-cloud-token"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your Hetzner Cloud API token for authentication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hetzner.hetznerNetworkName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="my-network"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The name for the Hetzner network that will be created.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hetzner.robotUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robot Username (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="robot-username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional robot username.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hetzner.robotPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robot Password (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="robot-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional robot password.
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