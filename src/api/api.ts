import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./models/schema";
import { useAuth } from "react-oidc-context";
import { useEffect, useMemo } from "react";
import { type EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";
import { envVars } from "@/env.ts";

const buildAuthHeaders = (token?: string) => {
    const headers: any = {}
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    return headers
}

const createDboxedFetchClient = (token?: string) => {
    return createFetchClient<paths>({
        baseUrl: envVars.VITE_API_URL,
        headers: buildAuthHeaders(token),
    })
}

export const useDboxedFetchClient = () => {
    const auth = useAuth()

    const client = useMemo(() => {
        return createDboxedFetchClient(auth.user?.access_token)
    }, [auth.isLoading, auth.user?.access_token])

    return client
}

export const useDboxedQueryClient = () => {
    const fetchClient = useDboxedFetchClient()

    const queryClient = useMemo(() => {
        return createClient(fetchClient);
    }, [fetchClient])

    return queryClient
}

interface EventSourceOptions {
    onopen?: (res: Response) => void
    onerror?: (err: any) => void
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
