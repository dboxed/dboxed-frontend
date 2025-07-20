import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUnboxedQueryClient } from "@/api/api"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import type { UseFormReturn, FieldValues } from "react-hook-form"
import { Form } from "@/components/ui/form.tsx";

interface BaseCreatePageProps<T extends FieldValues = FieldValues> {
  title: string
  children: (form: UseFormReturn<T>) => React.ReactNode
  apiRoute: string
  apiParams?: Record<string, any>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  submitButtonText?: string
  cancelButtonText?: string
  isLoading?: boolean
  onSubmit?: (data: T) => any
  defaultValues?: Partial<T>
  resolver?: any
}

export function BaseCreatePage<T extends FieldValues = FieldValues>({
  title,
  children,
  apiRoute,
  apiParams = {},
  onSuccess,
  onError,
  submitButtonText = "Create",
  cancelButtonText = "Cancel",
  isLoading = false,
  onSubmit,
  defaultValues,
  resolver
}: BaseCreatePageProps<T>) {
  const client = useUnboxedQueryClient()
  const navigate = useNavigate()
  
  const form = useForm<T>({
    defaultValues: defaultValues as any,
    resolver
  })
  
  const createMutation = client.useMutation('post', apiRoute as any)

  const handleFormSubmit = (data: T) => {
    if (onSubmit) {
      const processedData = onSubmit(data)
      if (processedData) {
        createMutation.mutate({
          params: apiParams,
          body: processedData,
        }, {
          onSuccess: (responseData) => {
            toast.success(`${title} created successfully!`)
            if (onSuccess) {
              onSuccess(responseData)
            } else {
              navigate(-1)
            }
          },
          onError: (error) => {
            toast.error(`Failed to create ${title.toLowerCase()}`, {
              description: error.detail || `An error occurred while creating the ${title.toLowerCase()}.`
            })
            if (onError) {
              onError(error)
            }
          }
        })
      }
      return
    }

    createMutation.mutate({
      params: apiParams,
      body: data,
    }, {
      onSuccess: (responseData) => {
        toast.success(`${title} created successfully!`)
        if (onSuccess) {
          onSuccess(responseData)
        } else {
          navigate(-1)
        }
      },
      onError: (error) => {
        toast.error(`Failed to create ${title.toLowerCase()}`, {
          description: error.detail || `An error occurred while creating the ${title.toLowerCase()}.`
        })
        if (onError) {
          onError(error)
        }
      }
    })
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const isSubmitting = createMutation.isPending || isLoading

  return (
    <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
      <Card className="w-full max-w-2xl my-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {children(form)}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
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
      {isSubmitting ? "Creating..." : submitButtonText}
    </Button>
  )
} 