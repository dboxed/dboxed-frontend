import { useState, type ComponentType } from "react"
import { Button } from "@/components/ui/button"
import type { FieldValues } from "react-hook-form";
import * as React from "react";

interface OpenDialogButtonProps<T extends FieldValues> extends Omit<React.ComponentProps<"button">, "onClick"> {
  children: React.ReactNode
  save: (data: T) => Promise<boolean>
  dialog: ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void; save: (data: T) => Promise<boolean> }>
}

export function OpenDialogButton<T extends FieldValues>({ children, dialog: Dialog, save, ...buttonProps }: OpenDialogButtonProps<T>) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleSave = async (data: T) => {
    const ret = await save(data)
    if (ret) {
      setOpen(false)
    }
    return ret
  }

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen} save={handleSave} />
    </>
  )
}
