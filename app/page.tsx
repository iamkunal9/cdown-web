"use client"

import type React from "react"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChainSelector, SUPPORTED_CHAINS, type Chain } from "@/components/chain-selector"

export default function Home() {
  const [contracts, setContracts] = useState("")
  const [selectedChain, setSelectedChain] = useState<Chain>(SUPPORTED_CHAINS[0])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contracts.trim()) {
      setStatus({ type: "error", message: "Please enter at least one contract address" })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      // Split by comma and trim whitespace
      const contractList = contracts
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c)

      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus({
        type: "success",
        message: `Processing ${contractList.length} contract${contractList.length > 1 ? "s" : ""} on ${selectedChain.name}...`,
      })

      // Here you would implement actual contract downloading logic
      console.log("Downloading contracts:", contractList)
      console.log("Chain:", selectedChain.name)
      console.log("Explorer API:", selectedChain.explorer)
    } catch (error) {
      setStatus({ type: "error", message: "Failed to download contracts" })
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
    </main>
  )
}
