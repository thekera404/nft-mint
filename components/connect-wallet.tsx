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

import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"

export function ConnectWallet() {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected } = useAccount()

  const handleConnect = async () => {
    try {
      // First, try to use Farcaster's wallet provider
      const provider = await sdk.wallet.getEthereumProvider()

      // Look for Farcaster-specific connector first
      const farcasterConnector = connectors.find(
        (connector) => 
          connector.id === "farcasterMiniApp" || 
          connector.name?.includes("Farcaster")
      )

      if (farcasterConnector) {
        connect({ connector: farcasterConnector })
        return
      }

      // Fallback to injected connector (should work with Farcaster's provider)
      const injectedConnector = connectors.find((connector) => connector.type === "injected")

      if (injectedConnector) {
        connect({ connector: injectedConnector })
        return
      }

    } catch (error) {
      console.error("Failed to connect with Farcaster provider:", error)
    }

    // Final fallback to any available connector
    try {
      const fallbackConnector = connectors[0]
      if (fallbackConnector) {
        connect({ connector: fallbackConnector })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  if (isConnected) return null

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={isPending}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0 disabled:opacity-50 transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </>
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm text-center">
          Connection failed. Please try again.
        </p>
      )}
    </div>
  )
}
