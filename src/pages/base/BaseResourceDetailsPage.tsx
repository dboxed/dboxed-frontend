import { useDboxedQueryClient } from "@/api/client.ts"
import type { paths } from "@/api/models/dboxed-schema"
import { BaseDetailsPage, type BaseDetailsPagePropsBase } from "./BaseDetailsPage"
import { useEffect, useMemo, useState } from "react";
import { useDboxedMutation } from "@/api/mutation.ts";

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

  const title = useMemo(() => {
    if (typeof props.title === 'function') {
      return props.title(resourceQuery.data)
    }
    return props.title
  }, [props.title, resourceQuery.data])

  const deleteMutation = useDboxedMutation('delete', props.resourcePath as any, {
    successMessage: `${title} deleted successfully!`,
    errorMessage: `Failed to delete ${title}`,
    refetchAll: true,
  })
  const saveMutation = useDboxedMutation('patch', props.resourcePath as any, {
    successMessage: `${title} has been saved!`,
    errorMessage: `Failed to save ${title}`,
    refetchPath: props.resourcePath,
  })

  const handleDelete = async () => {
    if (!props.enableDelete) {
      return false
    }

    return await deleteMutation.mutateAsync({
      params: props.apiParams as any,
    })
  }

  const handleSave = async (data: U) => {
    const ok = await saveMutation.mutateAsync({
      params: props.apiParams as any,
      body: data as any,
    })
    resourceQuery.refetch()
    return ok
  }

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
