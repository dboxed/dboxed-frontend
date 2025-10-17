import { useDboxedQueryClient } from "@/api/api"
import { toast } from "sonner"
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form"
import type { paths } from "@/api/models/schema"
import { useQueryClient } from "@tanstack/react-query"
import { SimpleFormDialog } from "./SimpleFormDialog.tsx"
import { deepClone } from "@/utils/clone.ts";

interface BaseCreateDialogProps<F extends FieldValues = FieldValues, C extends FieldValues = F, R extends FieldValues = FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: (form: UseFormReturn<F>) => React.ReactNode
  apiRoute: keyof paths
  apiParams?: Record<string, unknown>
  onSuccess?: (data: R) => (boolean | void) // when this returns false, the dialog is not closed automatically
  onError?: (error: any) => void
  submitButtonText?: string
  cancelButtonText?: string
  isLoading?: boolean
  onSubmit?: (data: F) => C
  defaultValues?: DefaultValues<F>
}

export function BaseCreateDialog<F extends FieldValues = FieldValues, C extends FieldValues = F, R extends FieldValues = FieldValues>({
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
}: BaseCreateDialogProps<F, C, R>) {
  const client = useDboxedQueryClient()
  const queryClient = useQueryClient()
  const createMutation = client.useMutation('post', apiRoute as any)

  const buildInitial = () => {
    return defaultValues
  }

  const handleSave = async (data: F) => {
    let processedData: C
    if (onSubmit) {
      processedData = onSubmit(deepClone(data))
    } else {
      processedData = data as unknown as C
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

      if (onSuccess) {
        const ret = onSuccess(responseData as R)
        if (typeof ret === "boolean") {
          return ret
        }
        return true
      }
      return true
    } catch (error: any) {
      toast.error(`Failed to create ${title.toLowerCase()}`, {
        description: error.detail || `An error occurred while creating the ${title.toLowerCase()}.`
      })
      if (onError) {
        onError(error)
      }
      return false
    }
  }

  const isSubmitting = createMutation.isPending || isLoading

  return (
    <SimpleFormDialog<F>
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