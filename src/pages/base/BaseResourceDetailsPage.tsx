import { useDboxedQueryClient } from "@/api/api"
import type { paths } from "@/api/models/schema"
import { BaseDetailsPage, type BaseDetailsPagePropsBase } from "./BaseDetailsPage"
import { useMemo } from "react";

interface BaseResourceDetailsPageProps<T, U> extends BaseDetailsPagePropsBase<T, U> {
  title: string | ((data?: T) => string)
  resourcePath: keyof paths
  apiParams?: Record<string, any>
  afterDeleteUrl?: string
}

export function BaseResourceDetailsPage<T, U>(props: BaseResourceDetailsPageProps<T, U>) {
  const client = useDboxedQueryClient()

  // Fetch the resource
  const resourceQuery = client.useQuery('get', props.resourcePath as any, {
    params: props.apiParams
  })

  const deleteMutation = props.enableDelete ? client.useMutation('delete', props.resourcePath as any) : null
  const saveMutation = client.useMutation('patch', props.resourcePath as any)

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

  const handleSave =  (data: U) => {
    return new Promise<void>((resolve, reject) => {
      saveMutation.mutate({
        params: props.apiParams as any,
        body: data as any,
      }, {
        onSuccess: data => {
          console.log("ok")
          resolve()
          resourceQuery.refetch()
        },
        onError: error => {
          console.log("err", error)
          reject(error)
          resourceQuery.refetch()
        },
      })
    })
  }

  const title = useMemo(() => {
    if (typeof props.title === 'function') {
      return props.title(resourceQuery.data)
    }
    return props.title
  }, [props.title, resourceQuery.data])

  return (
    <BaseDetailsPage<T, U>
      {...props}
      title={title}
      resourceData={resourceQuery.data as T}
      onDelete={handleDelete}
      onSave={handleSave}
      isLoading={resourceQuery.isLoading}
      isDeleting={deleteMutation?.isPending ?? false}
    >
      {props.children}
    </BaseDetailsPage>
  )
}
