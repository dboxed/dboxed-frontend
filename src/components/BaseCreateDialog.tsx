import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import { toast } from "sonner"
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form"
import type { paths } from "@/api/models/dboxed-schema"
import { useQueryClient } from "@tanstack/react-query"
import { SimpleFormDialog } from "./SimpleFormDialog.tsx"
import { deepClone } from "@/utils/utils.ts";
import type { ReactNode } from "react";

interface BaseCreateDialogProps<F extends FieldValues = FieldValues, C extends FieldValues = F, R extends FieldValues = FieldValues> {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: (form: UseFormReturn<F>) => ReactNode
  apiRoute: keyof paths
  apiParams?: Record<string, unknown>
  onSuccess?: (data: R) => (boolean | void) // when this returns false, the dialog is not closed automatically
  onError?: (error: any) => void
  submitButtonText?: string
  cancelButtonText?: string
  onSubmit?: (data: F) => C
  defaultValues?: DefaultValues<F>
}

export function BaseCreateDialog<F extends FieldValues = FieldValues, C extends FieldValues = F, R extends FieldValues = FieldValues>({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  apiRoute,
  apiParams = {},
  onSuccess,
  onError,
  submitButtonText = "Create",
  cancelButtonText = "Cancel",
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

  return (
    <SimpleFormDialog<F>
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      buildInitial={buildInitial}
      onSave={handleSave}
      saveText={submitButtonText}
      cancelText={cancelButtonText}
    >
      {children}
    </SimpleFormDialog>
  )
}