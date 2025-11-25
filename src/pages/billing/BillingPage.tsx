import { BasePage } from "@/pages/base/BasePage.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { PaymentMethodsTab } from "./PaymentMethodsTab"
import { BillingAddressTab } from "./BillingAddressTab"
import { InvoicesTab } from "./InvoicesTab"

export function BillingPage() {
  return (
    <BasePage title="Billing">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <InvoicesTab />
          </TabsContent>

          <TabsContent value="payment-methods">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="billing-address">
            <BillingAddressTab />
          </TabsContent>
        </Tabs>
      </div>
    </BasePage>
  )
}
