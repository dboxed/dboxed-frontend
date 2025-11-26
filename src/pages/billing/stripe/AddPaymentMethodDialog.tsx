import { SimpleDialog } from "@/components/SimpleDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { StripeCheckout } from "@/pages/billing/stripe/StripeCheckout.tsx";
import { useRef } from "react";

export function AddPaymentMethodDialog() {
  const ref = useRef<() => Promise<boolean>>(() => Promise.resolve(false))

  const handleSave = () => {
    if (ref.current) {
      return ref.current()
    }
    return new Promise<boolean>(resolve => resolve(false))
  }

  return <SimpleDialog
    trigger={<Button className="mt-4">
      <Plus className="mr-2 h-4 w-4"/>
      Add Payment Method
    </Button>}
    title="Add Payment Method"
    showSave={true}
    showCancel={true}
    onSave={handleSave}
  >
    <StripeCheckout handleSaveRef={ref}/>
  </SimpleDialog>
}