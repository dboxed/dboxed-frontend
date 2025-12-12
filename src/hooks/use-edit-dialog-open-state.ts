import { useState, useCallback } from "react"

interface EditDialogOpenState<T> {
  open: boolean
  setOpen: (open: boolean) => void
  item: T | null
  setItem: (item: T | null) => void
  dialogProps: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
}

export function useEditDialogOpenState<T>(): EditDialogOpenState<T> {
  const [open, setOpenState] = useState(false)
  const [item, setItemState] = useState<T | null>(null)

  const setOpen = useCallback((newOpen: boolean) => {
    setOpenState(newOpen)
  }, [])

  const setItem = useCallback((newItem: T | null) => {
    setItemState(newItem)
    setOpenState(newItem !== null)
  }, [])

  const dialogProps = {
    open,
    onOpenChange: setOpen,
  }

  return {
    open,
    setOpen,
    item,
    setItem,
    dialogProps,
  }
}
