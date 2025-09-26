import { useState, type ComponentType } from "react"
import { Button } from "@/components/ui/button"

interface OpenDialogButtonProps extends Omit<ButtonProps, "onClick"> {
  children: React.ReactNode
  dialog: ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>
}

export function OpenDialogButton({ children, dialog: Dialog, ...buttonProps }: OpenDialogButtonProps) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen} />
    </>
  )
}