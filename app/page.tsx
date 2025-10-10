"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Download, Loader2, FileText, Braces } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChainSelector, SUPPORTED_CHAINS, type Chain } from "@/components/chain-selector"
import { cn } from "@/lib/utils"

export default function Home() {
  const [contracts, setContracts] = useState("")
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [includeMetadata, setIncludeMetadata] = useState(false)
  const [includeAbi, setIncludeAbi] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contracts.trim()) {
      setStatus({ type: "error", message: "Please enter at least one contract address" })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addresses: contracts,
          chainId: selectedChain.chainId,
          includeMetadata,
          includeAbi,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to download contracts")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `contracts-${selectedChain.chainId}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setStatus({
        type: "success",
        message: `Downloading contracts for ${selectedChain.name}...`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to download contracts"
      setStatus({ type: "error", message: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-mono">
              cdown
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Download smart contract source code</p>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 items-center">
            <div className="relative group flex-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative">
                <Input
                  type="text"
                  placeholder="0x... (comma-separated for multiple)"
                  value={contracts}
                  onChange={(e) => setContracts(e.target.value)}
                  className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground font-mono text-sm px-6"
                  disabled={loading}
                />
              </div>
            </div>

            <ChainSelector selectedChain={selectedChain} onChainChange={setSelectedChain} disabled={loading} />
          </div>

          {/* Replace plain checkboxes with sleek option chips */}
          <div className="flex gap-3">
            <label
              htmlFor="include-metadata"
              className={cn(
                "flex-1 cursor-pointer rounded-lg border px-3 py-3",
                "flex items-center justify-center gap-2 text-sm transition-colors",
                includeMetadata
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-card/80 text-foreground",
              )}
              aria-disabled={loading}
            >
              <Checkbox
                id="include-metadata"
                checked={includeMetadata}
                onCheckedChange={(v: boolean) => setIncludeMetadata(!!v)}
                disabled={loading}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <FileText className="h-4 w-4" />
              <span className="select-none">Metadata</span>
            </label>

            <label
              htmlFor="include-abi"
              className={cn(
                "flex-1 cursor-pointer rounded-lg border px-3 py-3",
                "flex items-center justify-center gap-2 text-sm transition-colors",
                includeAbi
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card hover:bg-card/80 text-foreground",
              )}
              aria-disabled={loading}
            >
              <Checkbox
                id="include-abi"
                checked={includeAbi}
                onCheckedChange={(v: boolean) => setIncludeAbi(!!v)}
                disabled={loading}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Braces className="h-4 w-4" />
              <span className="select-none">ABI</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download
              </>
            )}
          </Button>
        </form>

        {/* Status message */}
        {status && (
          <div
            className={`p-4 rounded-lg border text-center font-mono text-sm ${
              status.type === "success"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Info text */}
        <div className="text-center text-muted-foreground text-sm space-y-2">
          <p>Enter contract addresses separated by commas</p>
          <p className="font-mono text-xs">Example: 0xabc..., 0xdef..., 0x123...</p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <footer className="absolute inset-x-0 bottom-4 z-10 text-center text-xs text-muted-foreground">
        {"made with love by "}
        <a
          href="https://iamkunal9.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-muted-foreground/50 underline-offset-4 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
        >
          {"iamkunal9"}
        </a>
      </footer>
    </main>
  )
}
