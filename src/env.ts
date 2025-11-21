
export const DEFAULT_API_URL = "https://api.dboxed.io"

// these are replaces via envsubst in run.sh
const initialEnvVars = {
  VITE_API_URL: '${VITE_API_URL}',
  VITE_API_URL_PUBLIC: '${VITE_API_URL_PUBLIC}',
  VITE_CLOUD_API_URL: '${VITE_CLOUD_API_URL}',
  VITE_OIDC_ISSUER_URL: '${VITE_OIDC_ISSUER_URL}',
  VITE_OIDC_CLIENT_ID: '${VITE_OIDC_CLIENT_ID}',
  VITE_OIDC_SCOPE: '${VITE_OIDC_SCOPE}',

  VITE_IS_CLOUD: '${VITE_IS_CLOUD}',
  VITE_IS_CLOUD_TEST_INSTANCE: '${VITE_IS_CLOUD_TEST_INSTANCE}',
  VITE_STRIPE_PUBLISHABLE_KEY: '${VITE_STRIPE_PUBLISHABLE_KEY}',

  VITE_MATOMO_TAG_MANAGER: '${VITE_MATOMO_TAG_MANAGER}',
}

export const buildEnvVars = (): typeof initialEnvVars => {
  const ret: any = {}
  Object.keys(initialEnvVars).forEach(k => {
    const fromEnv = (initialEnvVars as any)[k]
    if (fromEnv && !fromEnv.includes('{VITE_')) {
      ret[k] = fromEnv
    } else {
      ret[k] = import.meta.env[k]
    }
  })
  return ret
}

export const envVars = buildEnvVars()

export const isDboxedCloud = () => {
  return envVars.VITE_IS_CLOUD === "true" || envVars.VITE_IS_CLOUD === "1"
}

  export const isDboxedCloudTestInstance = () => {
  return envVars.VITE_IS_CLOUD_TEST_INSTANCE === "true" || envVars.VITE_IS_CLOUD_TEST_INSTANCE === "1"
}