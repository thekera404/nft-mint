"use client"

import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"

export function ConnectWallet() {
  const { connect, connectors, isPending } = useConnect()
  const { isConnected } = useAccount()

  const handleConnect = async () => {
    try {
      // Use Farcaster's wallet provider
      const provider = await sdk.wallet.getEthereumProvider()

      // Find the injected connector (should work with Farcaster's provider)
      const injectedConnector = connectors.find((connector) => connector.type === "injected")

      if (injectedConnector) {
        connect({ connector: injectedConnector })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      // Fallback to regular connection
      const injectedConnector = connectors[0]
      if (injectedConnector) {
        connect({ connector: injectedConnector })
      }
    }
  }

  if (isConnected) return null

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0"
    >
      <Wallet className="mr-2 h-5 w-5" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
