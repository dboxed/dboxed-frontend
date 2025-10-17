import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { UseFormReturn } from "react-hook-form"
import type { components } from "@/api/models/schema";

interface RusticConfigFormProps {
  form: UseFormReturn<components["schemas"]["CreateVolumeProvider"]>
}

export function RusticConfigForm({ form }: RusticConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rustic Configuration</CardTitle>
        <CardDescription>
          Configure the Rustic backup repository settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="rustic.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Rustic password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">S3 Storage Configuration</h3>

          <FormField
            control={form.control}
            name="rustic.storageS3.accessKeyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter S3 Access Key ID"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rustic.storageS3.secretAccessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Access Key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter S3 Secret Access Key"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rustic.storageS3.bucket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bucket</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter S3 bucket name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rustic.storageS3.endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter S3 endpoint URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rustic.storageS3.prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter S3 prefix (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}