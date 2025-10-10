import JSZip from "jszip"
import { NextRequest, NextResponse } from "next/server"

import { downloadContractSourceRecursive, type DownloadOptions } from "./utils"

export const runtime = "nodejs"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

type DownloadRequestBody = {
  addresses: string[] | string
  chainId: number
  includeAbi?: boolean
  includeMetadata?: boolean
  metadataIncludeKeys?: string[]
  metadataExcludeKeys?: string[]
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!ETHERSCAN_API_KEY) {
    return NextResponse.json(
      { error: "ETHERSCAN_API_KEY environment variable is not set" },
      { status: 500 },
    )
  }

  let body: DownloadRequestBody
  try {
    body = (await request.json()) as DownloadRequestBody
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
  }

  const {
    addresses,
    chainId,
    includeAbi = false,
    includeMetadata = false,
    metadataIncludeKeys,
    metadataExcludeKeys,
  } = body

  if (!chainId || Number.isNaN(Number(chainId))) {
    return NextResponse.json({ error: "chainId must be a valid number" }, { status: 400 })
  }

  const addressList = Array.isArray(addresses)
    ? addresses
    : typeof addresses === "string"
      ? addresses.split(",").map((addr) => addr.trim()).filter((addr) => addr.length > 0)
      : []

  if (addressList.length === 0) {
    return NextResponse.json({ error: "At least one contract address is required" }, { status: 400 })
  }

  if (metadataIncludeKeys && metadataExcludeKeys && metadataIncludeKeys.length > 0 && metadataExcludeKeys.length > 0) {
    return NextResponse.json(
      { error: "metadataIncludeKeys and metadataExcludeKeys cannot be used together" },
      { status: 400 },
    )
  }

  const includeSet = metadataIncludeKeys ? new Set(metadataIncludeKeys.map((key) => key.trim()).filter(Boolean)) : undefined
  const excludeSet = metadataExcludeKeys ? new Set(metadataExcludeKeys.map((key) => key.trim()).filter(Boolean)) : undefined

  const options: DownloadOptions = {
    includeAbi,
    includeMetadata,
    metadataIncludeKeys: includeSet,
    metadataExcludeKeys: excludeSet,
  }

  const zip = new JSZip()
  const visited = new Set<string>()

  try {
    for (const address of addressList) {
      await downloadContractSourceRecursive(address, chainId, zip, options, ETHERSCAN_API_KEY, visited)
    }

    const archive = await zip.generateAsync({ type: "arraybuffer" })
    const filename = `contracts-${chainId}-${Date.now()}.zip`

    return new NextResponse(archive, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${filename}`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export function GET(): Response {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}

