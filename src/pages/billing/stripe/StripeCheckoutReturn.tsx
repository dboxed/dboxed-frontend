import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "react-oidc-context";
import { useDboxedCloudQueryClient } from "@/api/client.ts";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { useDboxedCloudMutation } from "@/api/mutation.ts";

export const StripeCheckoutReturn = () => {
  const { workspaceId } = useSelectedWorkspaceId()
  const auth = useAuth();
  const [params] = useSearchParams()
  const client = useDboxedCloudQueryClient();
  const navigate = useNavigate()

  const sessionId = params.get("session_id") || "";
  const checkoutSession = client.useQuery("get", "/v1/cloud/workspaces/{workspaceId}/billing/stripe-checkout-session/{id}", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: sessionId,
      }
    }
  }, {
    enabled: auth.isAuthenticated,
  });

  const updateCustomerMutation = useDboxedCloudMutation("patch", "/v1/cloud/workspaces/{workspaceId}/billing/customer", {
    successMessage: "Default payment method updated!",
    errorMessage: "Failed to update default payment method",
    onComplete: () => {
      setTimeout(() => {
        navigate(`/workspaces/${workspaceId}/billing`)
      }, 2000)
    }
  });
  const [didUpdate, setDidUpdate] = useState(false)

  useEffect(() => {
    if (!checkoutSession.data) {
      return
    }
    if (didUpdate) {
      return
    }
    setDidUpdate(true)

    updateCustomerMutation.mutateAsync({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        defaultPaymentMethod: checkoutSession.data.setup_intent.payment_method.id,
      },
    })
  }, [checkoutSession.data])

  return <div className="text-center text-gray-500 py-8">Loading...</div>
}
