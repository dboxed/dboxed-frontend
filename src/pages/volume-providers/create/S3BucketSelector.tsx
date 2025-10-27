import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import { useDboxedQueryClient } from "@/api/api.ts"
import type { UseFormReturn, FieldValues, Path } from "react-hook-form"

interface S3BucketSelectorProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  fieldName: Path<TFieldValues>
  label?: string
  description?: string
}

export function S3BucketSelector<TFieldValues extends FieldValues>({
  form,
  fieldName,
  label = "S3 Bucket",
  description = "Select the S3 bucket to use for storage"
}: S3BucketSelectorProps<TFieldValues>) {
  const { workspaceId } = useSelectedWorkspaceId()
  const client = useDboxedQueryClient()

  const s3BucketsQuery = client.useQuery('get', "/v1/workspaces/{workspaceId}/s3-buckets", {
    params: {
      path: {
        workspaceId: workspaceId!,
      }
    }
  })

  const s3Buckets = s3BucketsQuery.data?.items || []

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value?.toString() || ""}
            onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an S3 bucket" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {s3BucketsQuery.isLoading ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading S3 buckets...</div>
              ) : s3Buckets.length > 0 ? (
                s3Buckets.map((bucket) => (
                  <SelectItem key={bucket.id} value={bucket.id.toString()}>
                    {bucket.bucket} ({bucket.endpoint})
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No S3 buckets available. Create one first.
                </div>
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
