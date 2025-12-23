import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import type { ReactNode } from "react";

interface FullScreenLoadingProps {
  title?: ReactNode
  description?: ReactNode
}

export function FullScreenLoading({
  title = "Loading",
  description = "Please wait...",
}: FullScreenLoadingProps) {
  return (
    <Empty className="w-full h-screen">
      <EmptyHeader>
        <img src="/dboxed-icon.svg" alt="DBoxed" className="h-32 w-32 mb-4" />
        <EmptyMedia variant="icon">
          <Spinner className={"size-16"}/>
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
