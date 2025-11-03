export interface DockerContainer {
  Command: string
  CreatedAt: string
  ID: string
  Image: string
  Labels: string
  Names: string
  Networks: string
  State: string
  Status: string
  Ports?: string
  RunningFor?: string
}

export async function decompressDockerPs(compressedData: string): Promise<DockerContainer[]> {
  try {
    // Decode base64
    const binaryString = atob(compressedData)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Decompress using DecompressionStream
    const stream = new Response(bytes).body
    if (!stream) {
      return []
    }

    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'))
    const decompressedResponse = new Response(decompressedStream)
    const decompressedText = await decompressedResponse.text()

    // Parse JSON lines
    const lines = decompressedText.trim().split('\n')
    const containers: DockerContainer[] = []

    for (const line of lines) {
      if (line.trim()) {
        try {
          containers.push(JSON.parse(line))
        } catch (e) {
          console.error('Failed to parse container line:', e)
        }
      }
    }

    return containers
  } catch (error) {
    console.error('Failed to decompress docker ps data:', error)
    return []
  }
}
