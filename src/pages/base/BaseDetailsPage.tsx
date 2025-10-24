import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { DeleteButton } from "@/components/DeleteButton"

export interface BaseDetailsPagePropsBase<T, U> {
  children: (data: T, save: (data: U) => Promise<boolean>) => React.ReactNode
  enableDelete?: boolean
  deleteButtonText?: string
  deleteConfirmationChildren?: (data: T) => React.ReactNode
  customButtons?: (data: T, save: (data: U) => Promise<boolean>) => React.ReactNode
}

interface BaseDetailsPageProps<T, U> extends BaseDetailsPagePropsBase<T, U> {
  title: string
  resourceData?: T
  onDelete?: () => Promise<void>
  onSave?: (data: U) => Promise<void>
  afterDeleteUrl?: string
  isLoading?: boolean
  isDeleting?: boolean
  error?: any
}

export function BaseDetailsPage<T, U>(props: BaseDetailsPageProps<T, U>) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (props.onDelete) {
      try {
        await props.onDelete()
        toast.success(`${props.title} deleted successfully!`)
      } catch (error: any) {
        toast.error(`Failed to delete ${props.title.toLowerCase()}`, {
          description: error.detail || `An error occurred while deleting the ${props.title.toLowerCase()}.`
        })
        return
      }
    }
    if (props.afterDeleteUrl) {
      navigate(props.afterDeleteUrl)
    }
  }

  const handleSave = async (data: U) => {
    if (props.onSave) {
      try {
        await props.onSave(data)
        toast.success(`${props.title} saved successfully!`)
        return true
      } catch (error: any) {
        toast.error(`Failed to save ${props.title.toLowerCase()}`, {
          description: error.detail || `An error occurred while saving the ${props.title.toLowerCase()}.`
        })
        return false
      }
    }
    return false
  }

  if (props.isLoading || !props.resourceData) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Loading resource...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (props.error) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">
              Failed to load resource: {props.error.detail || "An error occurred while loading the resource."}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 w-full overflow-y-auto">
      <Card className="w-full max-w-7xl my-8">
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {props.children(props.resourceData, handleSave)}
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {props.enableDelete && (
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
    </div>
  )
}
