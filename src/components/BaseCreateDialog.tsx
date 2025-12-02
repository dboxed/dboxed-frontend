import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form"
import type { paths } from "@/api/models/dboxed-schema"
import { SimpleFormDialog } from "./SimpleFormDialog.tsx"
import { deepClone } from "@/utils/utils.ts";
import type { ReactNode } from "react";
import { useDboxedMutation } from "@/api/mutation.ts";

interface BaseCreateDialogProps<F extends FieldValues = FieldValues, C extends FieldValues = F, R extends FieldValues = FieldValues> {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: (form: UseFormReturn<F>) => ReactNode
  apiRoute: keyof paths
  apiParams?: Record<string, unknown>
  onSuccess?: (data: R) => void // when this returns false, the dialog is not closed automatically
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
  const createMutation = useDboxedMutation('post', apiRoute as any, {
    successMessage: `${title} created successfully!`,
    errorMessage: `Failed to create ${title.toLowerCase()}`,
    refetchPath: apiRoute,
    onSuccess: onSuccess,
    onError: onError,
  })

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

    return await createMutation.mutateAsync({
      params: apiParams,
      body: processedData,
    })
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