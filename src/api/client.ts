import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { useAuth } from "react-oidc-context";
import { useEffect, useMemo } from "react";
import { type EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";
import { envVars } from "@/env.ts";
import { buildAuthHeaders } from "@/api/auth.ts";
import type { paths } from "@/api/models/dboxed-schema";
import type { paths as paths_cloud } from "@/api/models/dboxed-cloud-schema";

export function useDboxedQueryClientBase<Paths extends {}>(apiUrl: string) {
    const auth = useAuth()
    const fetchClient = useMemo(() => {
        return createFetchClient<Paths>({
            baseUrl: apiUrl,
            headers: buildAuthHeaders(auth.user?.access_token),
        })
    }, [apiUrl, auth.user?.access_token])

    const queryClient = useMemo(() => {
        return createClient(fetchClient);
    }, [fetchClient])

    return queryClient
}

export function useDboxedQueryClient() {
    return useDboxedQueryClientBase<paths>(envVars.VITE_API_URL)
}

export function useDboxedCloudQueryClient() {
    return useDboxedQueryClientBase<paths_cloud>(envVars.VITE_CLOUD_API_URL)
}

interface EventSourceOptions {
    onopen?: (res: Response) => void
    onerror?: (err: unknown) => void
    onmessage?: (e: EventSourceMessage) => void
    onclose?: () => void;
    enabled?: boolean
}

export const useDboxedApiEventSource = (url: string, opts: EventSourceOptions) => {
    const enabled = typeof opts.enabled === "boolean" ? opts.enabled : true

    const auth = useAuth()
    useEffect(() => {
        const ctrl = new AbortController();

        if (!enabled) {
            return
        }

        fetchEventSource(url, {
            headers: buildAuthHeaders(auth.user?.access_token),
            onopen: async (res) => {
                if (opts.onopen) {
                    opts.onopen(res)
                }
            },
            onerror: (err) => {
                if (opts.onerror) {
                    opts.onerror(err)
                }
            },
            onmessage: (msg) => {
                if (opts.onmessage) {
                    opts.onmessage(msg)
                }
            },
            onclose: () => {
                if (opts.onclose) {
                    opts.onclose()
                }
            },
            signal: ctrl.signal,
        })

        return () => ctrl.abort()
    }, [url, enabled]);

    return null
}
