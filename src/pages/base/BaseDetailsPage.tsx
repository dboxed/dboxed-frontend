import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { UseFormReturn, FieldValues } from "react-hook-form"
import { Form } from "@/components/ui/form.tsx"
import { DeleteButton } from "@/components/DeleteButton"

export interface BaseDetailsPagePropsBase<T extends FieldValues, U extends FieldValues> {
  children: (data: T, form: UseFormReturn<U>) => React.ReactNode
  enableDelete?: boolean
  enableSave?: boolean
  submitButtonText?: string
  cancelButtonText?: string
  deleteButtonText?: string
  buildUpdateDefaults?: (data: T) => U
  resolver?: any
  customButtons?: (data: T, form: UseFormReturn<U>) => React.ReactNode
}

interface BaseDetailsPageProps<T extends FieldValues, U extends FieldValues> extends BaseDetailsPagePropsBase<T, U> {
  title: string
  resourceData?: T
  onUpdate?: (data: U) => Promise<void>
  onDelete?: () => Promise<void>
  afterDeleteUrl?: string
  isLoading?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  error?: any
}

export function BaseDetailsPage<T extends FieldValues, U extends FieldValues>(props: BaseDetailsPageProps<T, U>) {
  const submitButtonText = props.submitButtonText || "Save"
  const cancelButtonText = props.cancelButtonText || "Cancel"

  const navigate = useNavigate()

  const form = useForm<U>({
    resolver: props.resolver
  })

  // Build update defaults when resource data changes
  useEffect(() => {
    if (props.resourceData && props.buildUpdateDefaults) {
      const defaults = props.buildUpdateDefaults(props.resourceData)
      form.reset(defaults)
    }
  }, [props.resourceData])

  const handleFormSubmit = async (data: U) => {
    if (props.onUpdate) {
      try {
        await props.onUpdate(data)
        toast.success(`${props.title} updated successfully!`)
      } catch (error: any) {
        toast.error(`Failed to update ${props.title.toLowerCase()}`, {
          description: error.detail || `An error occurred while updating the ${props.title.toLowerCase()}.`
        })
        return
      }
    }
    navigate(-1)
  }
  const handleDelete = async () => {
    if (props.onDelete) {
      try {
        await props.onDelete()
        toast.success(`${props.title} deleted successfully!`)
      } catch (error: any) {
        toast.error(`Failed to delete ${props.title.toLowerCase()}`, {
          description: error.detail || `An error occurred while deleting the ${props.title.toLowerCase()}.`
        })
        return
      }
    }
    if (props.afterDeleteUrl) {
      navigate(props.afterDeleteUrl)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const isSubmitting = !!(props.isUpdating || props.isDeleting || props.isLoading)

  if (props.isLoading || !props.resourceData) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Loading resource...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (props.error) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">
              Failed to load resource: {props.error.detail || "An error occurred while loading the resource."}
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
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {props.children(props.resourceData, form)}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {props.enableDelete && (
              <DeleteButton
                onDelete={handleDelete}
                resourceName={props.title}
                disabled={isSubmitting}
                isLoading={props.isDeleting}
                buttonText={props.deleteButtonText}
              />
            )}
          </div>
          <div className="flex space-x-2">
            {props.customButtons && (
              <>
                {props.customButtons(props.resourceData, form)}
              </>
            )}
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
            {props.enableSave && (
              <FormSubmitButton
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                submitButtonText={submitButtonText}
                form={form}
              />
            )}
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