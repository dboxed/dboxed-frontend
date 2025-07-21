import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUnboxedQueryClient } from "@/api/api"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { UseFormReturn, FieldValues } from "react-hook-form"
import { Form } from "@/components/ui/form.tsx"
import type { paths } from "@/api/models/schema";
import { DeleteButton } from "@/components/DeleteButton";

interface BaseDetailsPageProps<T extends FieldValues, U extends FieldValues> {
  title: string
  children: (data: T, form: UseFormReturn<U>) => React.ReactNode
  resourcePath: keyof paths
  enableDelete?: boolean,
  apiParams?: Record<string, any>
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  onDelete?: () => void
  onDeleteError?: (error: any) => void
  submitButtonText?: string
  cancelButtonText?: string
  deleteButtonText?: string
  isLoading?: boolean
  resolver?: any
  buildUpdateDefaults?: (data: T) => U
}

export function BaseDetailsPage<T extends FieldValues, U extends FieldValues>({
  title,
  children,
  resourcePath,
  enableDelete,
  apiParams = {},
  onSuccess,
  onError,
  onDelete,
  onDeleteError,
  submitButtonText = "Save",
  cancelButtonText = "Cancel",
  deleteButtonText = "Delete",
  isLoading = false,
  resolver,
  buildUpdateDefaults
}: BaseDetailsPageProps<T, U>) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()

  const form = useForm<U>({
    resolver
  })
  
  // Fetch the resource
  const resourceQuery = client.useQuery('get', resourcePath as any, {
    params: apiParams
  })
  
  // Update mutation for PATCH
  const updateMutation = client.useMutation('patch', resourcePath as any)

  // Delete mutation for DELETE (only if deletePath is provided)
  const deleteMutation = enableDelete ? client.useMutation('delete', resourcePath as any) : null

  // Build update defaults when resource is loaded
  useEffect(() => {
    if (resourceQuery.data && buildUpdateDefaults) {
      const defaults = buildUpdateDefaults(resourceQuery.data as unknown as T)
      form.reset(defaults)
    }
  }, [resourceQuery.data, buildUpdateDefaults, form])

  const handleFormSubmit = (data: U) => {
    if (!resourceQuery.data) {
      toast.error("No resource data available")
      return
    }

    console.log(data)

    updateMutation.mutate({
      params: apiParams as any,
      body: data as any,
    }, {
      onSuccess: (responseData) => {
        toast.success(`${title} updated successfully!`)
        if (onSuccess) {
          onSuccess(responseData as any)
        } else {
          navigate(-1)
        }
      },
      onError: (error) => {
        toast.error(`Failed to update ${title.toLowerCase()}`, {
          description: error.detail || `An error occurred while updating the ${title.toLowerCase()}.`
        })
        if (onError) {
          onError(error)
        }
      }
    })
  }

  const handleDelete = () => {
    if (!deleteMutation) {
      return
    }

    deleteMutation.mutate({
      params: apiParams as any,
    }, {
      onSuccess: () => {
        toast.success(`${title} deleted successfully!`)
        if (onDelete) {
          onDelete()
        } else {
          navigate(-1)
        }
      },
      onError: (error) => {
        toast.error(`Failed to delete ${title.toLowerCase()}`, {
          description: error.detail || `An error occurred while deleting the ${title.toLowerCase()}.`
        })
        if (onDeleteError) {
          onDeleteError(error)
        }
      }
    })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const isSubmitting = updateMutation.isPending || (deleteMutation?.isPending ?? false) || isLoading
  const isLoadingResource = resourceQuery.isLoading

  // Show loading state while fetching resource
  if (isLoadingResource) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Loading resource...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if resource fetch failed
  if (resourceQuery.error) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">
              Failed to load resource: {resourceQuery.error.detail || "An error occurred while loading the resource."}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              {cancelButtonText}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {children(resourceQuery.data as any, form)}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          <div>
            {enableDelete && (
              <DeleteButton
                onDelete={handleDelete}
                resourceName={title.toLowerCase()}
                disabled={isSubmitting}
                isLoading={deleteMutation?.isPending ?? false}
                buttonText={deleteButtonText}
              />
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
            <FormSubmitButton 
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              submitButtonText={submitButtonText}
              form={form}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper component to handle form submission
function FormSubmitButton<T extends FieldValues>({ 
  onSubmit, 
  isSubmitting, 
  submitButtonText,
  form
}: { 
  onSubmit: (data: T) => void
  isSubmitting: boolean
  submitButtonText: string
  form: UseFormReturn<T>
}) {
  const handleClick = () => {
    form.handleSubmit(onSubmit)()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Saving..." : submitButtonText}
    </Button>
  )
}