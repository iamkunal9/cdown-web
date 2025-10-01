"use client"

import { useState } from "react"
import { Check, ChevronDown, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Chain {
  id: string
  name: string
  chainId: number
  icon?: string
  explorer: string
}

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum Mainnet",
    chainId: 1,
    icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    explorer: "https://api.etherscan.io",
  },
  { id: "sepolia", name: "Sepolia Testnet", chainId: 11155111, explorer: "https://api-sepolia.etherscan.io" },
  { id: "holesky", name: "Holesky Testnet", chainId: 17000, explorer: "https://api-holesky.etherscan.io" },
  { id: "hoodi", name: "Hoodi Testnet", chainId: 560048, explorer: "https://api-hoodi.etherscan.io" },
  { id: "abstract", name: "Abstract Mainnet", chainId: 2741, explorer: "https://api.abscan.org" },
  {
    id: "abstract-sepolia",
    name: "Abstract Sepolia Testnet",
    chainId: 11124,
    explorer: "https://api-sepolia.abscan.org",
  },
  { id: "apechain-curtis", name: "ApeChain Curtis Testnet", chainId: 33111, explorer: "https://api-curtis.apescan.io" },
  { id: "apechain", name: "ApeChain Mainnet", chainId: 33139, explorer: "https://api.apescan.io" },
  {
    id: "arbitrum-nova",
    name: "Arbitrum Nova",
    chainId: 42170,
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    explorer: "https://api-nova.arbiscan.io",
  },
  {
    id: "arbitrum",
    name: "Arbitrum One",
    chainId: 42161,
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    explorer: "https://api.arbiscan.io",
  },
  {
    id: "arbitrum-sepolia",
    name: "Arbitrum Sepolia",
    chainId: 421614,
    icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
    explorer: "https://api-sepolia.arbiscan.io",
  },
  {
    id: "avalanche",
    name: "Avalanche C-Chain",
    chainId: 43114,
    icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
    explorer: "https://api.snowtrace.io",
  },
  {
    id: "avalanche-fuji",
    name: "Avalanche Fuji",
    chainId: 43113,
    icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
    explorer: "https://api-testnet.snowtrace.io",
  },
  {
    id: "base",
    name: "Base Mainnet",
    chainId: 8453,
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    explorer: "https://api.basescan.org",
  },
  {
    id: "base-sepolia",
    name: "Base Sepolia",
    chainId: 84532,
    icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    explorer: "https://api-sepolia.basescan.org",
  },
  { id: "berachain", name: "Berachain Mainnet", chainId: 80094, explorer: "https://api.beratrail.io" },
  { id: "berachain-bepolia", name: "Berachain Bepolia", chainId: 80069, explorer: "https://api-bepolia.beratrail.io" },
  { id: "bittorrent", name: "BitTorrent Chain", chainId: 199, explorer: "https://api.bttcscan.com" },
  { id: "bittorrent-testnet", name: "BitTorrent Testnet", chainId: 1029, explorer: "https://api-testnet.bttcscan.com" },
  { id: "blast", name: "Blast Mainnet", chainId: 81457, explorer: "https://api.blastscan.io" },
  { id: "blast-sepolia", name: "Blast Sepolia", chainId: 168587773, explorer: "https://api-sepolia.blastscan.io" },
  {
    id: "bsc",
    name: "BNB Smart Chain",
    chainId: 56,
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    explorer: "https://api.bscscan.com",
  },
  {
    id: "bsc-testnet",
    name: "BNB Testnet",
    chainId: 97,
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    explorer: "https://api-testnet.bscscan.com",
  },
  {
    id: "celo-alfajores",
    name: "Celo Alfajores",
    chainId: 44787,
    icon: "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
    explorer: "https://api-alfajores.celoscan.io",
  },
  {
    id: "celo",
    name: "Celo Mainnet",
    chainId: 42220,
    icon: "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
    explorer: "https://api.celoscan.io",
  },
  {
    id: "cronos",
    name: "Cronos Mainnet",
    chainId: 25,
    icon: "https://icons.llamao.fi/icons/chains/rsz_cronos.jpg",
    explorer: "https://api.cronoscan.com",
  },
  { id: "fraxtal", name: "Fraxtal Mainnet", chainId: 252, explorer: "https://api.fraxscan.com" },
  { id: "fraxtal-testnet", name: "Fraxtal Testnet", chainId: 2522, explorer: "https://api-holesky.fraxscan.com" },
  {
    id: "gnosis",
    name: "Gnosis",
    chainId: 100,
    icon: "https://icons.llamao.fi/icons/chains/rsz_xdai.jpg",
    explorer: "https://api.gnosisscan.io",
  },
  { id: "hyperevm", name: "HyperEVM Mainnet", chainId: 999, explorer: "https://api.hyperscan.xyz" },
  {
    id: "linea",
    name: "Linea Mainnet",
    chainId: 59144,
    icon: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
    explorer: "https://api.lineascan.build",
  },
  {
    id: "linea-sepolia",
    name: "Linea Sepolia",
    chainId: 59141,
    icon: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
    explorer: "https://api-sepolia.lineascan.build",
  },
  {
    id: "mantle",
    name: "Mantle Mainnet",
    chainId: 5000,
    icon: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
    explorer: "https://api.mantlescan.xyz",
  },
  {
    id: "mantle-sepolia",
    name: "Mantle Sepolia",
    chainId: 5003,
    icon: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
    explorer: "https://api-sepolia.mantlescan.xyz",
  },
  { id: "memecore", name: "Memecore Testnet", chainId: 43521, explorer: "https://api-testnet.memescan.io" },
  {
    id: "moonbase",
    name: "Moonbase Alpha",
    chainId: 1287,
    icon: "https://icons.llamao.fi/icons/chains/rsz_moonbeam.jpg",
    explorer: "https://api-moonbase.moonscan.io",
  },
  { id: "monad", name: "Monad Testnet", chainId: 10143, explorer: "https://api-testnet.monadexplorer.com" },
  {
    id: "moonbeam",
    name: "Moonbeam",
    chainId: 1284,
    icon: "https://icons.llamao.fi/icons/chains/rsz_moonbeam.jpg",
    explorer: "https://api-moonbeam.moonscan.io",
  },
  {
    id: "moonriver",
    name: "Moonriver",
    chainId: 1285,
    icon: "https://icons.llamao.fi/icons/chains/rsz_moonriver.jpg",
    explorer: "https://api-moonriver.moonscan.io",
  },
  {
    id: "optimism",
    name: "OP Mainnet",
    chainId: 10,
    icon: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    explorer: "https://api-optimistic.etherscan.io",
  },
  {
    id: "optimism-sepolia",
    name: "OP Sepolia",
    chainId: 11155420,
    icon: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    explorer: "https://api-sepolia-optimistic.etherscan.io",
  },
  {
    id: "polygon",
    name: "Polygon Mainnet",
    chainId: 137,
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    explorer: "https://api.polygonscan.com",
  },
  {
    id: "polygon-amoy",
    name: "Polygon Amoy",
    chainId: 80002,
    icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    explorer: "https://api-amoy.polygonscan.com",
  },
  { id: "katana", name: "Katana Mainnet", chainId: 747474, explorer: "https://api.katanascan.io" },
  { id: "katana-bokuto", name: "Katana Bokuto", chainId: 737373, explorer: "https://api-bokuto.katanascan.io" },
  { id: "sei", name: "Sei Mainnet", chainId: 1329, explorer: "https://api.seitrace.com" },
  { id: "sei-testnet", name: "Sei Testnet", chainId: 1328, explorer: "https://api-testnet.seitrace.com" },
  {
    id: "scroll",
    name: "Scroll Mainnet",
    chainId: 534352,
    icon: "https://icons.llamao.fi/icons/chains/rsz_scroll.jpg",
    explorer: "https://api.scrollscan.com",
  },
  {
    id: "scroll-sepolia",
    name: "Scroll Sepolia",
    chainId: 534351,
    icon: "https://icons.llamao.fi/icons/chains/rsz_scroll.jpg",
    explorer: "https://api-sepolia.scrollscan.com",
  },
  { id: "sonic-testnet", name: "Sonic Testnet", chainId: 14601, explorer: "https://api-testnet.sonicscan.org" },
  { id: "sonic", name: "Sonic Mainnet", chainId: 146, explorer: "https://api.sonicscan.org" },
  { id: "sophon", name: "Sophon Mainnet", chainId: 50104, explorer: "https://api.sophonscan.xyz" },
  { id: "sophon-sepolia", name: "Sophon Sepolia", chainId: 531050104, explorer: "https://api-sepolia.sophonscan.xyz" },
  { id: "swellchain", name: "Swellchain Mainnet", chainId: 1923, explorer: "https://api.swellscan.io" },
  { id: "swellchain-testnet", name: "Swellchain Testnet", chainId: 1924, explorer: "https://api-testnet.swellscan.io" },
  { id: "taiko", name: "Taiko Mainnet", chainId: 167000, explorer: "https://api.taikoscan.io" },
  { id: "taiko-hoodi", name: "Taiko Hoodi", chainId: 167012, explorer: "https://api-hoodi.taikoscan.io" },
  { id: "unichain", name: "Unichain Mainnet", chainId: 130, explorer: "https://api.uniscan.xyz" },
  { id: "unichain-sepolia", name: "Unichain Sepolia", chainId: 1301, explorer: "https://api-sepolia.uniscan.xyz" },
  { id: "world", name: "World Mainnet", chainId: 480, explorer: "https://api.worldscan.org" },
  { id: "world-sepolia", name: "World Sepolia", chainId: 4801, explorer: "https://api-sepolia.worldscan.org" },
  { id: "xdc-apothem", name: "XDC Apothem", chainId: 51, explorer: "https://api-apothem.xdcscan.io" },
  { id: "xdc", name: "XDC Mainnet", chainId: 50, explorer: "https://api.xdcscan.io" },
  {
    id: "zksync",
    name: "zkSync Mainnet",
    chainId: 324,
    icon: "https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg",
    explorer: "https://api-era.zksync.network",
  },
  {
    id: "zksync-sepolia",
    name: "zkSync Sepolia",
    chainId: 300,
    icon: "https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg",
    explorer: "https://api-sepolia-era.zksync.network",
  },
  {
    id: "opbnb",
    name: "opBNB Mainnet",
    chainId: 204,
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    explorer: "https://api-opbnb.bscscan.com",
  },
  {
    id: "opbnb-testnet",
    name: "opBNB Testnet",
    chainId: 5611,
    icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    explorer: "https://api-opbnb-testnet.bscscan.com",
  },
]

interface ChainSelectorProps {
  selectedChain: Chain
  onChainChange: (chain: Chain) => void
  disabled?: boolean
}

export function ChainSelector({ selectedChain, onChainChange, disabled }: ChainSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="h-14 px-4 justify-between bg-card border-border hover:bg-card/80 hover:border-border/80 group relative overflow-hidden min-w-[180px]"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300" />
          <div className="relative flex items-center gap-2 w-full">
            {selectedChain.icon ? (
              <img
                src={selectedChain.icon || "/placeholder.svg"}
                alt={selectedChain.name}
                className="w-5 h-5 rounded-full flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextElementSibling?.classList.remove("hidden")
                }}
              />
            ) : null}
            <HelpCircle className={cn("w-5 h-5 flex-shrink-0 text-muted-foreground", selectedChain.icon && "hidden")} />
            <span className="font-mono text-xs truncate">{selectedChain.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 relative" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-card border-border" align="start">
        <Command className="bg-card">
          <CommandInput placeholder="Search chain..." className="h-9 font-mono text-sm" />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {SUPPORTED_CHAINS.map((chain) => (
                <CommandItem
                  key={chain.id}
                  value={`${chain.name} ${chain.chainId}`}
                  onSelect={() => {
                    onChainChange(chain)
                    setOpen(false)
                  }}
                  className="font-mono text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {chain.icon ? (
                      <img
                        src={chain.icon || "/placeholder.svg"}
                        alt={chain.name}
                        className="w-5 h-5 rounded-full flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : null}
                    <HelpCircle className={cn("w-5 h-5 flex-shrink-0 text-muted-foreground", chain.icon && "hidden")} />
                    <div className="flex flex-col items-start">
                      <span>{chain.name}</span>
                      <span className="text-xs text-muted-foreground">Chain ID: {chain.chainId}</span>
                    </div>
                  </div>
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedChain.id === chain.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
