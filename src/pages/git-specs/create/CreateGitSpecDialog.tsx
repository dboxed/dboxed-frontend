import { BaseCreateDialog } from "@/components/BaseCreateDialog.tsx"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useSelectedWorkspaceId } from "@/components/workspace-switcher.tsx"
import type { components } from "@/api/models/dboxed-schema"

interface CreateGitSpecDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGitSpecDialog({ open, onOpenChange }: CreateGitSpecDialogProps) {
  const { workspaceId } = useSelectedWorkspaceId()

  return (
    <BaseCreateDialog<components["schemas"]["CreateGitSpec"]>
      open={open}
      onOpenChange={onOpenChange}
      title="Create Git Spec"
      apiRoute="/v1/workspaces/{workspaceId}/git-specs"
      apiParams={{
        path: {
          workspaceId: workspaceId,
        }
      }}
      defaultValues={{
        gitUrl: "",
        specFile: "dboxed-specs.yaml",
        subdir: "",
      }}
    >
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="gitUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Git URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/org/repo.git"
                    autoCapitalize="off"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The git repository URL to clone
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subdir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdirectory</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(optional)"
                    autoCapitalize="off"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional subdirectory within the repository
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spec File</FormLabel>
                <FormControl>
                  <Input
                    placeholder="boxspec.yaml"
                    autoCapitalize="off"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The path to the box spec file within the repository
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </BaseCreateDialog>
  )
}
