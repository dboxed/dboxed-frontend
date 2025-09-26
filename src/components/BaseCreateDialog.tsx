import { useDboxedQueryClient } from "@/api/api"
import { toast } from "sonner"
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form"
import type { paths } from "@/api/models/schema"
import { useQueryClient } from "@tanstack/react-query"
import { SimpleFormDialog } from "./SimpleFormDialog.tsx"

interface BaseCreateDialogProps<T extends FieldValues = FieldValues, R extends FieldValues = FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: (form: UseFormReturn<T>) => React.ReactNode
  apiRoute: keyof paths
  apiParams?: Record<string, unknown>
  onSuccess?: (data: R) => void
  onError?: (error: any) => void
  submitButtonText?: string
  cancelButtonText?: string
  isLoading?: boolean
  onSubmit?: (data: T) => T
  defaultValues?: DefaultValues<T>
}

export function BaseCreateDialog<T extends FieldValues = FieldValues, R extends FieldValues = FieldValues>({
  open,
  onOpenChange,
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
}: BaseCreateDialogProps<T, R>) {
  const client = useDboxedQueryClient()
  const queryClient = useQueryClient()
  const createMutation = client.useMutation('post', apiRoute as any)

  const buildInitial = () => {
    return defaultValues
  }

  const handleSave = async (data: T) => {
    let processedData = data
    if (onSubmit) {
      // make a copy first
      processedData = JSON.parse(JSON.stringify(data))
      processedData = onSubmit(processedData)
    }

    try {
      const responseData = await new Promise((resolve, reject) => {
        createMutation.mutate({
          params: apiParams,
          body: processedData,
        }, {
          onSuccess: resolve,
          onError: reject
        })
      })

      await queryClient.invalidateQueries()

      toast.success(`${title} created successfully!`)
      onOpenChange(false)

      if (onSuccess) {
        onSuccess(responseData as R)
      }
    } catch (error: any) {
      toast.error(`Failed to create ${title.toLowerCase()}`, {
        description: error.detail || `An error occurred while creating the ${title.toLowerCase()}.`
      })
      if (onError) {
        onError(error)
      }
      throw error // Re-throw to prevent dialog from closing
    }
  }

  const isSubmitting = createMutation.isPending || isLoading

  return (
    <SimpleFormDialog<T>
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText={submitButtonText}
      cancelText={cancelButtonText}
      isLoading={isSubmitting}
    >
      {children}
    </SimpleFormDialog>
  )
}