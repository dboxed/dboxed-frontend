import { useNavigate } from "react-router"
import { DeleteButton } from "@/components/DeleteButton"

export interface BaseDetailsPagePropsBase<T, U> {
  children: (data: T, save: (data: U) => Promise<boolean>) => React.ReactNode
  enableDelete?: boolean | ((data: T) => boolean)
  deleteButtonText?: string
  deleteConfirmationChildren?: (data: T) => React.ReactNode
  customButtons?: (data: T, save: (data: U) => Promise<boolean>) => React.ReactNode
}

interface BaseDetailsPageProps<T, U> extends BaseDetailsPagePropsBase<T, U> {
  title: string
  resourceData?: T
  onDelete?: () => Promise<boolean>
  onSave?: (data: U) => Promise<boolean>
  afterDeleteUrl?: string
  isLoading?: boolean
  isDeleting?: boolean
  error?: any
}

export function BaseDetailsPage<T, U>(props: BaseDetailsPageProps<T, U>) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!props.onDelete) {
      return true
    }
    const ok = await props.onDelete()
    if (ok && props.afterDeleteUrl) {
      navigate(props.afterDeleteUrl)
    }
    return ok
  }

  const handleSave = async (data: U) => {
    if (!props.onSave) {
      return false
    }
    return await props.onSave(data)
  }

  if (props.isLoading || !props.resourceData) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
        <div className="text-muted-foreground">Loading resource...</div>
      </div>
    )
  }

  if (props.error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
        <div className="text-red-600">
          Failed to load resource: {props.error.detail || "An error occurred while loading the resource."}
        </div>
      </div>
    )
  }

  const enableDelete = props.enableDelete !== undefined && (typeof props.enableDelete === "boolean" ? props.enableDelete : props.enableDelete(props.resourceData))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{props.title}</h2>
        <div className="flex items-center space-x-2">
          {props.customButtons && props.customButtons(props.resourceData, handleSave)}
          {enableDelete && (
            <DeleteButton
              onDelete={handleDelete}
              resourceName={props.title}
              isLoading={props.isDeleting}
              buttonText={props.deleteButtonText}
            >
              {props.deleteConfirmationChildren && props.deleteConfirmationChildren(props.resourceData)}
            </DeleteButton>
          )}
        </div>
      </div>
      {props.children(props.resourceData, handleSave)}
    </div>
  )
}
