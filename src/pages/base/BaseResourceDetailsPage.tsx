import { useDboxedQueryClient } from "@/api/api"
import { toast } from "sonner"
import type { FieldValues } from "react-hook-form"
import type { paths } from "@/api/models/schema"
import { BaseDetailsPage, type BaseDetailsPagePropsBase } from "./BaseDetailsPage"
import { useMemo } from "react";

interface BaseResourceDetailsPageProps<T extends FieldValues, U extends FieldValues> extends BaseDetailsPagePropsBase<T, U> {
  title: string | ((data?: T) => string)
  resourcePath: keyof paths
  apiParams?: Record<string, any>
  afterDeleteUrl?: string
}

export function BaseResourceDetailsPage<T extends FieldValues, U extends FieldValues>(props: BaseResourceDetailsPageProps<T, U>) {
  const client = useDboxedQueryClient()

  // Fetch the resource
  const resourceQuery = client.useQuery('get', props.resourcePath as any, {
    params: props.apiParams
  })
  
  // Update mutation for PATCH
  const updateMutation = client.useMutation('patch', props.resourcePath as any)

  // Delete mutation for DELETE (only if enableDelete is true)
  const deleteMutation = props.enableDelete ? client.useMutation('delete', props.resourcePath as any) : null

  const title = useMemo(() => {
    if (typeof props.title === 'function') {
      return props.title(resourceQuery.data)
    }
    return props.title
  }, [props.title, resourceQuery.data])

  const handleUpdate = async (data: U) => {
    if (!resourceQuery.data) {
      toast.error("No resource data available")
      return
    }

    await new Promise((resolve, reject) => {
      updateMutation.mutate({
        params: props.apiParams as any,
        body: data as any,
      }, {
        onSuccess: data => resolve(data),
        onError: error => reject(error),
      })
    })
  }

  const handleDelete = async () => {
    if (!deleteMutation) {
      return
    }

    await new Promise((resolve, reject) => {
      deleteMutation.mutate({
        params: props.apiParams as any,
      }, {
        onSuccess: data => resolve(data),
        onError: error => reject(error),
      })
    })
  }


  return (
    <BaseDetailsPage<T, U>
      {...props}
      title={title}
      resourceData={resourceQuery.data as T}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={resourceQuery.isLoading}
      isUpdating={updateMutation.isPending}
      isDeleting={deleteMutation?.isPending ?? false}
    >
      {props.children}
    </BaseDetailsPage>
  )
}
