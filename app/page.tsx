"use client"

import { useEffect, useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, CheckCircle } from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"
import { ConnectWallet } from "@/components/connect-wallet"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export default function NFTMintPage() {
  const [isReady, setIsReady] = useState(false)
  const [supply, setSupply] = useState({ current: 773, max: 10000 })
  const [mintPrice] = useState("0.001") // ETH

  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await sdk.actions.ready()
        setIsReady(true)
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error)
        setIsReady(true) // Continue even if SDK fails
      }
    }

    initializeApp()
  }, [])

  const handleMint = async () => {
    if (!isConnected || !address) return

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mint",
        args: [address, 1], // mint 1 NFT to connected address
        value: parseEther(mintPrice),
      })
    } catch (error) {
      console.error("Minting failed:", error)
    }
  }

  const openInWallet = () => {
    if (hash) {
      window.open(`https://basescan.org/tx/${hash}`, "_blank")
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mint Your NFT</h1>
          <p className="text-purple-200">Exclusive collection on Base</p>
        </div>

        {/* NFT Preview Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6 overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-4xl">🎨</span>
              </div>
            </div>
            {/* Supply badge */}
            <Badge className="absolute top-4 right-4 bg-black/50 text-white border-0">
              Supply: {supply.current} / {supply.max}
            </Badge>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Base NFT Collection</h3>
            <p className="text-purple-200 text-sm mb-4">A unique digital collectible on the Base network</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-200">Price</span>
              <span className="text-white font-semibold">{mintPrice} ETH</span>
            </div>
          </div>
        </Card>

        {/* Wallet Connection & Minting */}
        <div className="space-y-4">
          {!isConnected ? (
            <ConnectWallet />
          ) : (
            <div className="space-y-4">
              {/* Connected wallet info */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Connected</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    Base Network
                  </Badge>
                </div>
                <p className="text-white font-mono text-sm mt-1">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              {/* Mint Button */}
              <Button
                onClick={handleMint}
                disabled={isPending || isConfirming}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isPending ? "Confirm in Wallet..." : "Minting..."}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Minted Successfully!
                  </>
                ) : (
                  "Mint NFT"
                )}
              </Button>

              {/* Transaction link */}
              {hash && (
                <Button
                  variant="outline"
                  onClick={openInWallet}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Transaction
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          <p>Powered by Base • Built for Farcaster</p>
        </div>
      </div>
    </div>
  )
}
