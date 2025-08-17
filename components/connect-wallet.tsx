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






// nex3
"use client"

import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ConnectWallet() {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected } = useAccount()
  const [isFarcasterContext, setIsFarcasterContext] = useState(false)

  useEffect(() => {
    const detectFarcasterContext = () => {
      // Check if running in Farcaster mobile app
      const userAgent = navigator.userAgent.toLowerCase()
      const isFarcasterMobile = userAgent.includes("farcaster")

      // Check if running in Farcaster web context
      const isFarcasterWeb =
        window.location.hostname.includes("farcaster.xyz") ||
        window.parent !== window || // iframe context
        document.referrer.includes("farcaster")

      // Check for Farcaster SDK availability
      const hasFarcasterSDK = typeof window !== "undefined" && (window as any).farcaster !== undefined

      return isFarcasterMobile || isFarcasterWeb || hasFarcasterSDK
    }

    setIsFarcasterContext(detectFarcasterContext())
  }, [])

  const handleConnect = async () => {
    try {
      console.log(
        "[v0] Available connectors:",
        connectors.map((c) => ({ id: c.id, name: c.name })),
      )

      if (isFarcasterContext) {
        // In Farcaster context, prefer Farcaster connector
        const farcasterConnector = connectors.find(
          (connector) => connector.id === "farcasterMiniApp" || connector.name?.includes("Farcaster"),
        )

        if (farcasterConnector) {
          console.log("[v0] Using Farcaster connector in Farcaster context")
          connect({ connector: farcasterConnector })
          return
        }
      }

      // Try MetaMask first, then injected, then any available connector
      const metaMaskConnector = connectors.find(
        (connector) => connector.id === "metaMask" || connector.name?.toLowerCase().includes("metamask"),
      )

      const injectedConnector = connectors.find((connector) => connector.id === "injected")

      const targetConnector = metaMaskConnector || injectedConnector || connectors[0]

      if (targetConnector) {
        console.log("[v0] Using connector:", targetConnector.name || targetConnector.id)
        connect({ connector: targetConnector })
      } else {
        console.error("[v0] No connectors available")
        throw new Error("No wallet connectors available")
      }
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)
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
            {isFarcasterContext ? "Connect Farcaster Wallet" : "Connect Wallet"}
          </>
        )}
      </Button>

      {error && <p className="text-red-400 text-sm text-center">Connection failed. Please try again.</p>}
    </div>
  )
}

