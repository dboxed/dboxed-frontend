import type { HttpMethod, PathsWithMethod } from "openapi-typescript-helpers";
import { useDboxedQueryClientBase } from "@/api/client.ts";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { envVars } from "@/env.ts";
import type { paths } from "@/api/models/dboxed-schema";
import type { paths as paths_cloud } from "@/api/models/dboxed-cloud-schema";

interface UseMutationOpts<
  Method extends HttpMethod,
  Paths extends Record<string, Record<Method, {}>>
> {
  successMessage: string
  errorMessage: string
  refetchPath?: keyof Paths
  refetchAll?: boolean
  onComplete?: () => void
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
}

export function useDboxedMutationBase<
  Method extends HttpMethod,
  Paths extends {},
>(apiUrl: string, method: Method, url: PathsWithMethod<Paths, Method>, opts: UseMutationOpts<Method, Paths>) {

  const queryClient = useQueryClient()
  const client = useDboxedQueryClientBase<Paths>(apiUrl)

  const mutation = client.useMutation(method, url)

  const mutateAsync = async (variables: Parameters<typeof mutation.mutateAsync>[0], options?: Parameters<typeof mutation.mutateAsync>[1]) => {
    try {
      const result = await mutation.mutateAsync(variables, options)
      toast.success(opts.successMessage)
      if (opts.refetchPath) {
        queryClient.invalidateQueries({ queryKey: ['get', opts.refetchPath] })
      }
      if (opts.refetchAll) {
        queryClient.invalidateQueries()
      }
      if (opts.onSuccess) {
        opts.onSuccess(result)
      }
      if (opts.onComplete) {
        opts.onComplete()
      }
      return true
    } catch (error: any) {
      toast.error(opts.errorMessage, {
        description: error.detail || "An error occurred while performing API invocation"
      });
      console.error(opts.errorMessage, error);
      if (opts.onError) {
        opts.onError(error)
      }
      if (opts.onComplete) {
        opts.onComplete()
      }
      return false
    }
  }

  return {
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    mutateAsync: mutateAsync,
  }
}

export function useDboxedMutation<
  Method extends HttpMethod,
  Paths extends {} = paths
>(method: Method, url: PathsWithMethod<Paths, Method>, opts: UseMutationOpts<Method, Paths>) {
  return useDboxedMutationBase(envVars.VITE_API_URL, method, url, opts)
}

export function useDboxedCloudMutation<
  Method extends HttpMethod,
  Paths extends {} = paths_cloud
>(method: Method, url: PathsWithMethod<Paths, Method>, opts: UseMutationOpts<Method, Paths>) {
  return useDboxedMutationBase(envVars.VITE_CLOUD_API_URL, method, url, opts)
}
