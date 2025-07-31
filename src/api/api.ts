import createFetchClient, { type HeadersOptions } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./models/schema";
import { useAuth } from "react-oidc-context";
import { useEffect, useMemo, useState } from "react";
import { type EventSourceMessage, fetchEventSource } from "@microsoft/fetch-event-source";
import { envVars } from "@/env.ts";

const buildAuthHeaders = (token?: string) => {
    const headers: any = {}
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    return headers
}

const createUnboxedFetchClient = (token?: string) => {
    return createFetchClient<paths>({
        baseUrl: envVars.VITE_API_URL,
        headers: buildAuthHeaders(token),
    })
}

export const useUnboxedFetchClient = () => {
    const auth = useAuth()

    const client = useMemo(() => {
        return createUnboxedFetchClient(auth.user?.access_token)
    }, [auth.isLoading, auth.user?.access_token])

    client.GET

    return client
}

export const useUnboxedQueryClient = () => {
    const fetchClient = useUnboxedFetchClient()

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
}

export const useUnboxedApiEventSource = (url: string, opts: EventSourceOptions) => {
    const auth = useAuth()
    useEffect(() => {
        const ctrl = new AbortController();

        fetchEventSource(url, {
            headers: buildAuthHeaders(auth.user?.access_token),
            onopen: async (res) => {
                console.log("onopen", res)
                if (opts.onopen) {
                    opts.onopen(res)
                }
            },
            onerror: (err) => {
                console.log("onerror", err)
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
    }, [url]);

    return null
}
