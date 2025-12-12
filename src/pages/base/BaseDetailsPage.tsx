import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading resource...</div>
        </CardContent>
      </Card>
    )
  }

  if (props.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            Failed to load resource: {props.error.detail || "An error occurred while loading the resource."}
          </div>
        </CardContent>
      </Card>
    )
  }

  const enableDelete = props.enableDelete !== undefined && (typeof props.enableDelete === "boolean" ? props.enableDelete : props.enableDelete(props.resourceData))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {props.children(props.resourceData, handleSave)}
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <div className="flex items-center space-x-2">
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
        <div className="flex space-x-2">
          {props.customButtons && (
            <>
              {props.customButtons(props.resourceData, handleSave)}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
