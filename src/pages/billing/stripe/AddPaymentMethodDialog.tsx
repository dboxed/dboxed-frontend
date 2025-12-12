import { SimpleDialog } from "@/components/SimpleDialog.tsx";
import { StripeCheckout } from "@/pages/billing/stripe/StripeCheckout.tsx";
import { useRef } from "react";

interface AddPaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPaymentMethodDialog({ open, onOpenChange }: AddPaymentMethodDialogProps) {
  const ref = useRef<() => Promise<boolean>>(() => Promise.resolve(false))

  const handleSave = () => {
    if (ref.current) {
      return ref.current()
    }
    return new Promise<boolean>(resolve => resolve(false))
  }

  return <SimpleDialog
    open={open}
    onOpenChange={onOpenChange}
    title="Add Payment Method"
    showSave={true}
    showCancel={true}
    onSave={handleSave}
  >
    <StripeCheckout handleSaveRef={ref}/>
  </SimpleDialog>
}