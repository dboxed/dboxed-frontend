import type { components } from "@/api/models/dboxed-schema"

type Machine = components["schemas"]["Machine"]

/**
 * Gets the public IP address from a machine's provider-specific status.
 * Checks both AWS and Hetzner status fields.
 */
export function getMachinePublicIp(machine: Machine): string | null {
  if (machine.aws?.status?.publicIp4) {
    return machine.aws.status.publicIp4
  }
  if (machine.hetzner?.status?.publicIp4) {
    return machine.hetzner.status.publicIp4
  }
  return null
}

/**
 * Gets the cloud provider ID from a machine's provider-specific status.
 * Returns the instance ID for AWS or server ID for Hetzner.
 */
export function getMachineCloudId(machine: Machine): string | null {
  if (machine.aws?.status?.instanceId) {
    return machine.aws.status.instanceId
  }
  if (machine.hetzner?.status?.serverId) {
    return machine.hetzner.status.serverId.toString()
  }
  return null
}
