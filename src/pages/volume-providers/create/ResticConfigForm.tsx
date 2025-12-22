import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import type { UseFormReturn } from "react-hook-form"
import { S3BucketSelector } from "./S3BucketSelector.tsx"

interface ResticConfigFormProps {
  form: UseFormReturn<any>
}

export function ResticConfigForm({ form }: ResticConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restic Configuration</CardTitle>
        <CardDescription>
          Configure the Restic backup repository settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="restic.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Restic password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("restic.storageType") === "s3" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="restic.storageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="s3">S3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <S3BucketSelector
                form={form}
                fieldName="restic.s3BucketId"
                label="S3 Bucket"
                description=""
              />
            </div>

            <FormField
              control={form.control}
              name="restic.storagePrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Prefix</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="backup/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {!form.watch("restic.storageType") && (
          <FormField
            control={form.control}
            name="restic.storageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="s3">S3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}