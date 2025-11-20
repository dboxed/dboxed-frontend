import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "react-oidc-context";
import { useDboxedCloudQueryClient } from "@/api/dboxed-cloud-api.ts";
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx";
import { toast } from "sonner";

export const StripeCheckoutReturn = () => {
  const { workspaceId } = useSelectedWorkspaceId()
  const auth = useAuth();
  const [params] = useSearchParams()
  const client = useDboxedCloudQueryClient();
  const navigate = useNavigate()

  const sessionId = params.get("session_id") || "";
  const checkoutSession = client.useQuery("get", "/v1/workspaces/{workspaceId}/billing/stripe-checkout-session/{id}", {
    params: {
      path: {
        workspaceId: workspaceId!,
        id: sessionId,
      }
    }
  }, {
    enabled: auth.isAuthenticated,
  });

  const updateCustomerMutation = client.useMutation("patch", "/v1/workspaces/{workspaceId}/billing/customer");
  const [didUpdate, setDidUpdate] = useState(false)

  useEffect(() => {
    if (!checkoutSession.data) {
      return
    }
    if (didUpdate) {
      return
    }
    setDidUpdate(true)

    updateCustomerMutation.mutate({
      params: {
        path: {
          workspaceId: workspaceId!,
        }
      },
      body: {
        defaultPaymentMethod: checkoutSession.data.setup_intent.payment_method.id,
      },
    }, {
      onSuccess: () => {
        toast.success("Default payment method updated!")
        navigate(`/workspaces/${workspaceId}/billing`)
      },
      onError: (error) => {
        toast.error("Failed to update default payment method", {
          description: error.detail || "An error occurred while updating the default payment method."
        })
        setTimeout(() => {
          navigate(`/workspaces/${workspaceId}/billing`)
        }, 2000)
      }
    })
  }, [checkoutSession.data])

  return <div className="text-center text-gray-500 py-8">Loading...</div>
}
