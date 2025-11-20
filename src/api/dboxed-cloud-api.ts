import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./models/dboxed-cloud-schema";
import { useAuth } from "react-oidc-context";
import { useMemo } from "react";
import { envVars } from "@/env.ts";
import { buildAuthHeaders } from "@/api/auth.ts";

const createDboxedCloudFetchClient = (token?: string) => {
    return createFetchClient<paths>({
        baseUrl: envVars.VITE_CLOUD_API_URL,
        headers: buildAuthHeaders(token),
    })
}

export const useDboxedCloudFetchClient = () => {
    const auth = useAuth()

    const client = useMemo(() => {
        return createDboxedCloudFetchClient(auth.user?.access_token)
    }, [auth.isLoading, auth.user?.access_token])

    return client
}

export const useDboxedCloudQueryClient = () => {
    const fetchClient = useDboxedCloudFetchClient()

    const queryClient = useMemo(() => {
        return createClient(fetchClient);
    }, [fetchClient])

    return queryClient
}
