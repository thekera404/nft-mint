"use client"

import { useEffect, useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"
import { ConnectWallet } from "@/components/connect-wallet"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract"

export default function NFTMintPage() {
  const [isReady, setIsReady] = useState(false)
  // const [isFarcasterContext, setIsFarcasterContext] = useState(false)

  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const { data: mintActive } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "mintActive",
  })

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
  })

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "MAX_SUPPLY",
  })

  const { data: hasMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasMinted",
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("[v0] Initializing Farcaster SDK...")
        await sdk.actions.ready()
        console.log("[v0] Farcaster SDK ready")
        setIsReady(true)
      } catch (error) {
        console.error("[v0] Failed to initialize Farcaster SDK:", error)
        setIsReady(true) // Continue even if SDK fails
      }
    }

    initializeApp()
  }, [])




  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       console.log("[v0] Initializing Farcaster SDK...")
  //       const isInFarcaster =
  //         typeof window !== "undefined" && (window.parent !== window || window.location !== window.parent.location)

  //       if (isInFarcaster) {
  //         setIsFarcasterContext(true)
  //         await Promise.race([
  //           sdk.actions.ready(),
  //           new Promise((_, reject) => setTimeout(() => reject(new Error("SDK timeout")), 5000)),
  //         ])
  //       }

  //       console.log("[v0] Farcaster SDK ready")
  //       setIsReady(true)
  //     } catch (error) {
  //       console.error("[v0] Failed to initialize Farcaster SDK:", error)
  //       setIsReady(true) // Continue even if SDK fails
  //     }
  //   }

  //   initializeApp()
  // }, [])



  const handleMint = async () => {
    if (!isConnected || !address) return

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "freeMint",
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

  const canMint = mintActive && !hasMinted && isConnected
  const getMintButtonText = () => {
    if (!mintActive) return "Minting Not Active"
    if (hasMinted) return "Already Minted"
    if (isPending || isConfirming) {
      return isPending ? "Confirm in Wallet..." : "Minting..."
    }
    if (isSuccess) return "Minted Successfully!"
    return "Free Mint"
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0F] to-[#15151F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0F0F17] rounded-2xl shadow-2xl border border-[#1F1F2A] p-4">

        {/* NFT Preview Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6 overflow-hidden p-0">          
          <div className="relative aspect-square">
            <img src="/nft.gif" alt="NFT Preview" className="w-full h-full object-cover" />
            {/* Supply badge */}
            <Badge className="absolute top-4 right-4 bg-black/60 text-white border-0">
              Supply: {totalSupply?.toString() || "0"} / {maxSupply?.toString() || "0"}
            </Badge>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Based Nouns Club</h3>
            <p className="text-purple-200 text-sm mb-4">Mint your exclusive NFT from the Based Nouns Club collection. Each user can mint only 1 NFT.</p>

            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-200">Price</span>
              <span className="text-green-400 font-semibold">FREE</span>
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

              {!mintActive && (
                <div className="bg-orange-500/10 backdrop-blur-md rounded-lg p-4 border border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-300 text-sm">Minting is currently inactive</span>
                  </div>
                </div>
              )}

              {hasMinted && (
                <div className="bg-blue-500/10 backdrop-blur-md rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-300 text-sm">You have already minted your free NFT</span>
                  </div>
                </div>
              )}

              {/* Mint Button */}
              <Button
                onClick={handleMint}
                disabled={!canMint || isPending || isConfirming}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0 disabled:opacity-50"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {getMintButtonText()}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {getMintButtonText()}
                  </>
                ) : (
                  getMintButtonText()
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

        {/* OpenSea link */}
        <div className="mt-4 flex justify-center">
          <a
            href="https://opensea.io/collection/basednounsclub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg hover:bg-[#2A2A34] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-400"
            >
              <path
                d="M45 0C69.8514 0 90 20.1486 90 45C90 69.8514 69.8514 90 45 90C20.1486 90 0 69.8514 0 45C0 20.1486 20.1486 0 45 0Z"
                fill="currentColor"
              />
              <path
                d="M22.2011 46.512L22.3952 46.2069L34.1016 27.8939C34.2726 27.6257 34.6749 27.6535 34.8043 27.9447C36.76 32.3277 38.4475 37.7786 37.6569 41.1721C37.3194 42.5683 36.3948 44.4593 35.3545 46.2069C35.2204 46.4612 35.0725 46.7109 34.9153 46.9513C34.8413 47.0622 34.7165 47.127 34.5824 47.127H22.5432C22.2196 47.127 22.0301 46.7756 22.2011 46.512Z"
                fill="white"
              />
            </svg>
            <span className="text-sm text-gray-300">View on OpenSea</span>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300 text-sm">
          <p>Powered by Base • Built for Farcaster</p>
        </div>
      </div>
    </div>
  )
}
