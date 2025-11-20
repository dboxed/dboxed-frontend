import { useDboxedQueryClient } from "@/api/dboxed-api.ts"
import type { paths } from "@/api/models/dboxed-schema"
import { BaseDetailsPage, type BaseDetailsPagePropsBase } from "./BaseDetailsPage"
import { useEffect, useMemo, useState } from "react";

interface BaseResourceDetailsPageProps<T, U> extends BaseDetailsPagePropsBase<T, U> {
  title: string | ((data?: T) => string)
  resourcePath: keyof paths
  apiParams?: Record<string, any>
  afterDeleteUrl?: string
  refreshInterval?: number
  refreshTrigger?: number
}

export function BaseResourceDetailsPage<T, U>(props: BaseResourceDetailsPageProps<T, U>) {
  const client = useDboxedQueryClient()

  const refreshInterval = props.refreshInterval !== undefined ? props.refreshInterval : 5000

  // Fetch the resource
  const resourceQuery = client.useQuery('get', props.resourcePath as any, {
    params: props.apiParams,
  }, {
    refetchInterval: refreshInterval,
  })

  const [lastRefreshTrigger, setLastRefreshTrigger] = useState(props.refreshTrigger)
  useEffect(() => {
    if (props.refreshTrigger === lastRefreshTrigger) {
      return
    }
    setLastRefreshTrigger(props.refreshTrigger)
    resourceQuery.refetch()
  }, [resourceQuery, lastRefreshTrigger, props.refreshTrigger]);

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
        onSuccess: _data => {
          resolve()
          resourceQuery.refetch()
        },
        onError: error => {
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
