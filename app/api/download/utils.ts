import type JSZip from "jszip"

export type SourceResult = {
  SourceCode: string
  ContractName?: string
  ABI?: string
  Proxy?: string
  Implementation?: string
  [key: string]: unknown
}

export type DownloadOptions = {
  includeAbi: boolean
  includeMetadata: boolean
  metadataIncludeKeys?: Set<string>
  metadataExcludeKeys?: Set<string>
}

const SINGLE_FILE_PREFIXES = ["pragma", "//", "/*", "\r\n"]

export function sanitizePathSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9_.\-]/g, "_") || "Contract"
}

export function isSingleFileContract(src: string): boolean {
  const trimmed = src.trimStart()
  return SINGLE_FILE_PREFIXES.some((prefix) => trimmed.startsWith(prefix))
}

function doubleCurlyWrapped(txt: string): boolean {
  return txt.trimStart().startsWith("{{") && txt.trimEnd().endsWith("}}")
}

function parseJsonOrNull<T>(txt: string): T | null {
  try {
    return JSON.parse(txt) as T
  } catch (error) {
    return null
  }
}

export function parseSourceCodeObject(blob: string): Record<string, unknown> | Array<[string, unknown]> {
  let txt = blob.trim()
  if (doubleCurlyWrapped(txt)) {
    txt = txt.slice(1, -1).trim()
  }

  const parsed =
    parseJsonOrNull<Record<string, unknown> | Array<[string, unknown]>>(txt) ??
    parseJsonOrNull<Record<string, unknown> | Array<[string, unknown]>>(txt.slice(1, -1))

  if (!parsed) {
    throw new Error("Could not decode SourceCode JSON bundle")
  }

  if (!Array.isArray(parsed) && typeof parsed === "object" && "sources" in parsed) {
    const sources = (parsed as { sources: Record<string, unknown> }).sources
    if (!sources || typeof sources !== "object") {
      throw new Error("Invalid sources object inside SourceCode bundle")
    }
    return sources
  }

  return parsed
}

export function sourcesToMap(
  parsed: Record<string, unknown> | Array<[string, unknown]>,
): Record<string, string> {
  if (!Array.isArray(parsed)) {
    return Object.entries(parsed).reduce<Record<string, string>>((acc, [name, meta]) => {
      if (meta && typeof meta === "object" && "content" in (meta as Record<string, unknown>)) {
        acc[name] = String((meta as { content: string }).content)
      } else {
        acc[name] = String(meta ?? "")
      }
      return acc
    }, {})
  }

  return parsed.reduce<Record<string, string>>((acc, [name, meta]) => {
    if (meta && typeof meta === "object" && "content" in (meta as Record<string, unknown>)) {
      acc[name] = String((meta as { content: string }).content)
    } else {
      acc[name] = String(meta ?? "")
    }
    return acc
  }, {})
}

export function filterMetadata(
  metadata: Record<string, unknown>,
  includeKeys?: Set<string>,
  excludeKeys?: Set<string>,
): Record<string, unknown> {
  if (includeKeys && includeKeys.size > 0) {
    return Object.fromEntries(
      Object.entries(metadata).filter(([key]) => includeKeys.has(key)),
    )
  }

  if (excludeKeys && excludeKeys.size > 0) {
    return Object.fromEntries(
      Object.entries(metadata).filter(([key]) => !excludeKeys.has(key)),
    )
  }

  return { ...metadata }
}

const API_URL = "https://api.etherscan.io/v2/api"
const RATE_LIMIT_WINDOW_MS = 1_000
const RATE_LIMIT_MAX_REQUESTS = 3
const MIN_SPACING_MS = Math.ceil(RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX_REQUESTS) + 20

// Simple in-memory rate limiter to respect Etherscan's 3 req/sec cap
let requestTimestamps: number[] = []
let nextAvailableAt = 0
async function enforceRateLimit(): Promise<void> {
  while (true) {
    const now = Date.now()
    requestTimestamps = requestTimestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

    const windowDelay =
      requestTimestamps.length >= RATE_LIMIT_MAX_REQUESTS
        ? RATE_LIMIT_WINDOW_MS - (now - requestTimestamps[0])
        : 0
    const spacingDelay = Math.max(0, nextAvailableAt - now)
    const waitTime = Math.max(windowDelay, spacingDelay)

    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      continue
    }

    requestTimestamps.push(Date.now())
    nextAvailableAt = Date.now() + MIN_SPACING_MS
    return
  }
}

export async function fetchSource(
  address: string,
  chainId: number,
  apiKey: string,
): Promise<SourceResult> {
  await enforceRateLimit()

  const url = `${API_URL}?chainid=${chainId}&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`

  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })

  if (!response.ok) {
    throw new Error(`HTTP request failed with status ${response.status}`)
  }

  const data = (await response.json()) as { status?: string; result?: unknown }

  if (data.status !== "1" || !Array.isArray(data.result) || data.result.length === 0) {
    throw new Error(`Etherscan error for ${address}: ${JSON.stringify(data.result)}`)
  }

  return data.result[0] as SourceResult
}

export async function downloadContractSourceRecursive(
  address: string,
  chainId: number,
  zip: JSZip,
  options: DownloadOptions,
  apiKey: string,
  visited: Set<string>,
  basePath?: string,
): Promise<void> {
  const normalizedAddress = address.toLowerCase()

  if (visited.has(normalizedAddress)) {
    return
  }

  visited.add(normalizedAddress)

  const result = await fetchSource(normalizedAddress, chainId, apiKey)

  const contractName = sanitizePathSegment(String(result.ContractName ?? "Contract"))
  const folderPath = basePath
    ? `${basePath}/${contractName}-${normalizedAddress}`
    : `${contractName}-${normalizedAddress}`
  const folder = zip.folder(folderPath)

  if (!folder) {
    throw new Error("Failed to create folder in archive")
  }

  const srcBlob = result.SourceCode ?? ""

  if (!srcBlob) {
    throw new Error(`Contract ${normalizedAddress} is not verified or has no source code`)
  }

  if (isSingleFileContract(srcBlob)) {
    folder.file(`${contractName}.sol`, srcBlob)
  } else {
    const parsed = parseSourceCodeObject(srcBlob)
    const sourceMap = sourcesToMap(parsed)

    if (Object.keys(sourceMap).length === 0) {
      throw new Error(`No sources found inside bundle for ${normalizedAddress}`)
    }

    Object.entries(sourceMap).forEach(([name, code], index) => {
      const fileName = name ? name : `Contract${index + 1}.sol`
      folder.file(fileName, code)
    })
  }

  if (options.includeAbi) {
    folder.file("abi.json", String(result.ABI ?? ""))
  }

  if (options.includeMetadata) {
    const filteredMetadata = filterMetadata(
      result as Record<string, unknown>,
      options.metadataIncludeKeys,
      options.metadataExcludeKeys,
    )
    folder.file("contract_metadata.json", JSON.stringify(filteredMetadata, null, 2))
  }

  const isProxy = String(result.Proxy ?? "0") === "1"
  const implementation = String(result.Implementation ?? "").toLowerCase()

  if (
    isProxy &&
    implementation &&
    implementation !== "0x0000000000000000000000000000000000000000"
  ) {
    const implementationPath = `${folderPath}/implementation-${implementation}`
    await downloadContractSourceRecursive(
      implementation,
      chainId,
      zip,
      options,
      apiKey,
      visited,
      implementationPath,
    )
  }
}

