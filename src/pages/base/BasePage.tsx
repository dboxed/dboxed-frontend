interface BasePageProps {
  title: string;
  children: React.ReactNode;
}

export const BasePage: React.FC<BasePageProps> = ({ children }) => {
  return <>{children}</>
}