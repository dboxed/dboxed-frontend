import { parse } from "yaml";

export interface ComposeProjectInfo {
  name: string
  index: number
  content: string
  serviceCount: number
}

export const extractComposeProjectInfo = (project: string, index: number): ComposeProjectInfo => {
  let name = `<no-name-${index}>`
  let serviceCount = 0
  try {
    // we first try to find the line starting with name: and then parse that as yaml
    // the idea is that this should work even in cases where the rest of the yaml is invalid
    const re = /name:.*/;
    const m = re.exec(project)
    if (m) {
      const nameY = parse(m[0])
      name = nameY.name as string
    }
  } catch {
    // Ignore YAML parsing errors for project name extraction
  }

  try {
    // this might fail
    const y = parse(project)
    serviceCount = (Object.keys(y.services || {})).length
  } catch {
    // Ignore YAML parsing errors for service count
  }

  return {
    name: name,
    index: index,
    content: project,
    serviceCount: serviceCount,
  }
}
