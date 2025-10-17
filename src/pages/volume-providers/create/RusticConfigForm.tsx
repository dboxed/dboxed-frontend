import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import type { UseFormReturn } from "react-hook-form"
import { S3StorageForm } from "@/pages/volume-providers/S3StorageForm.tsx"

interface RusticConfigFormProps {
  form: UseFormReturn<any>
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

          <S3StorageForm
            form={form}
            fieldPrefix="rustic.storageS3."
            showProviderTypeSelector={true}
          />
        </div>
      </CardContent>
    </Card>
  )
}