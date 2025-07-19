import createFetchClient, { type HeadersOptions } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./models/schema";
import { useAuth } from "react-oidc-context";
import { useMemo } from "react";
import { envVars } from "@/env.ts";

const createUnboxedFetchClient = (token?: string) => {
    const headers: HeadersOptions = {}
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    return createFetchClient<paths>({
        baseUrl: envVars.VITE_API_URL,
        headers: headers,
    })
}

export const useUnboxedFetchClient = () => {
    const auth = useAuth()

    const client = useMemo(() => {
        return createUnboxedFetchClient(auth.user?.access_token)
    }, [auth.isLoading, auth.user?.access_token])

    return client
}

export const useUnboxedQueryClient = () => {
    const fetchClient = useUnboxedFetchClient()

    const queryClient = useMemo(() => {
        return createClient(fetchClient);
    }, [fetchClient])

    return queryClient
}
