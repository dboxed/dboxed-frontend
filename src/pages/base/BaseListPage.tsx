import { BasePage } from "./BasePage"
import type { FieldValues } from "react-hook-form"
import { BaseResourceList, type BaseResourceListProps } from "./BaseResourceList"

type BaseListPageProps<TData extends FieldValues> = BaseResourceListProps<TData>

export function BaseListPage<TData extends FieldValues>(props: BaseListPageProps<TData>) {
  return (
    <BasePage title={props.title}>
      <BaseResourceList {...props} />
    </BasePage>
  )
}
