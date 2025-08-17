// "use client"

// import { useConnect, useAccount } from "wagmi"
// import { Button } from "@/components/ui/button"
// import { Wallet } from "lucide-react"
// import { sdk } from "@farcaster/miniapp-sdk"

// export function ConnectWallet() {
//   const { connect, connectors, isPending } = useConnect()
//   const { isConnected } = useAccount()

//   const handleConnect = async () => {
//     try {
//       // Use Farcaster's wallet provider
//       const provider = await sdk.wallet.getEthereumProvider()

//       // Find the injected connector (should work with Farcaster's provider)
//       const injectedConnector = connectors.find((connector) => connector.type === "injected")

//       if (injectedConnector) {
//         connect({ connector: injectedConnector })
//       }
//     } catch (error) {
//       console.error("Failed to connect wallet:", error)
//       // Fallback to regular connection
//       const injectedConnector = connectors[0]
//       if (injectedConnector) {
//         connect({ connector: injectedConnector })
//       }
//     }
//   }

//   if (isConnected) return null

//   return (
//     <Button
//       onClick={handleConnect}
//       disabled={isPending}
//       className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0"
//     >
//       <Wallet className="mr-2 h-5 w-5" />
//       {isPending ? "Connecting..." : "Connect Wallet"}
//     </Button>
//   )
// }







// "use client"

// import { useConnect, useAccount } from "wagmi"
// import { Button } from "@/components/ui/button"
// import { Wallet, Loader2 } from "lucide-react"

// export function ConnectWallet() {
//   const { connect, connectors, isPending, error } = useConnect()
//   const { isConnected } = useAccount()

//   const handleConnect = async () => {
//     try {
//       const farcasterConnector = connectors.find(
//         (connector) => connector.id === "farcasterMiniApp" || connector.name?.includes("Farcaster"),
//       )

//       if (farcasterConnector) {
//         connect({ connector: farcasterConnector })
//       } else {
//         const fallbackConnector = connectors[0]
//         if (fallbackConnector) {
//           connect({ connector: fallbackConnector })
//         }
//       }
//     } catch (error) {
//       console.error("Failed to connect wallet:", error)
//     }
//   }

//   if (isConnected) return null

//   return (
//     <div className="space-y-2">
//       <Button
//         onClick={handleConnect}
//         disabled={isPending}
//         className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0 disabled:opacity-50"
//       >
//         {isPending ? (
//           <>
//             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//             Connecting...
//           </>
//         ) : (
//           <>
//             <Wallet className="mr-2 h-5 w-5" />
//             Connect Wallet
//           </>
//         )}
//       </Button>

//       {error && <p className="text-red-400 text-sm text-center">Connection failed. Please try again.</p>}
//     </div>
//   )
// }






"use client"

import { useEffect, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"

// Types for Farcaster SDK if available
declare global {
  interface Window {
    farcaster?: {
      wallet?: {
        chooseWallet?: () => Promise<{ address: string; name: string }>
      }
    }
  }
}

export function ConnectWallet() {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected } = useAccount()
  const [isFarcasterContext, setIsFarcasterContext] = useState(false)
  const [preferredWallet, setPreferredWallet] = useState<string | null>(null)

  useEffect(() => {
    const detectFarcasterContext = () => {
      if (typeof window === "undefined") return false

      const userAgent = navigator.userAgent.toLowerCase()
      const isFarcasterMobile = userAgent.includes("farcaster")

      const isFarcasterWeb =
        window.location.hostname.includes("farcaster.xyz") ||
        window.parent !== window ||
        document.referrer.includes("farcaster")

      const hasFarcasterSDK = !!window.farcaster

      return isFarcasterMobile || isFarcasterWeb || hasFarcasterSDK
    }

    setIsFarcasterContext(detectFarcasterContext())

    // Restore last chosen wallet
    const savedWallet = localStorage.getItem("preferredWallet")
    if (savedWallet) setPreferredWallet(savedWallet)
  }, [])

  const handleConnect = async () => {
    try {
      console.log(
        "[v2] Available connectors:",
        connectors.map((c) => ({ id: c.id, name: c.name })),
      )

      if (isFarcasterContext && window.farcaster?.wallet?.chooseWallet) {
        console.log("[v2] In Farcaster context → opening Farcaster wallet chooser")

        const chosen = await window.farcaster.wallet.chooseWallet()
        if (chosen?.name) {
          setPreferredWallet(chosen.name)
          localStorage.setItem("preferredWallet", chosen.name)
        }

        // Connect via Farcaster connector if available
        const farcasterConnector = connectors.find((c) => c.id === "farcasterMiniApp")
        if (farcasterConnector) {
          await connect({ connector: farcasterConnector })
          return
        }
      }

      // Outside Farcaster → let user pick from wagmi connectors
      let chosenConnector
      if (!preferredWallet) {
        // Auto-pick first available
        chosenConnector = connectors[0]
      } else {
        chosenConnector = connectors.find((c) =>
          c.name?.toLowerCase().includes(preferredWallet.toLowerCase()),
        )
      }

      if (!chosenConnector) {
        // fallback order
        chosenConnector =
          connectors.find((c) => c.id === "metaMask") ||
          connectors.find((c) => c.id === "injected") ||
          connectors[0]
      }

      if (chosenConnector) {
        console.log("[v2] Using connector:", chosenConnector.name || chosenConnector.id)
        setPreferredWallet(chosenConnector.name)
        localStorage.setItem("preferredWallet", chosenConnector.name)
        await connect({ connector: chosenConnector })
      } else {
        throw new Error("No wallet connectors available")
      }
    } catch (err) {
      console.error("[v2] Failed to connect wallet:", err)
    }
  }

  if (isConnected) return null

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0 disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            {preferredWallet
              ? `Connect ${preferredWallet}`
              : isFarcasterContext
              ? "Choose Farcaster Wallet"
              : "Choose Wallet"}
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm text-center">
          Connection failed. Please try again.
        </p>
      )}

      {preferredWallet && (
        <p className="text-xs text-center text-gray-400">
          Preferred wallet: {preferredWallet} <br />
          You can change it anytime in Settings.
        </p>
      )}
    </div>
  )
}
