import { Card, CardContent } from "@/components/ui/card.tsx";

interface BasePageProps {
  title: string;
  children: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  return <Card>
    <CardContent>
      {children}
    </CardContent>
  </Card>
}