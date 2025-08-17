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
// import { sdk } from "@farcaster/miniapp-sdk"

// export function ConnectWallet() {
//   const { connect, connectors, isPending, error } = useConnect()
//   const { isConnected } = useAccount()

//   const handleConnect = async () => {
//     try {
//       // Check if we're in a Farcaster context
//       if (typeof window !== 'undefined' && window.parent !== window) {
//         // We're in an iframe (Farcaster frame)
//         try {
//           // Try to get Farcaster's provider first
//           const provider = await sdk.wallet.getEthereumProvider()
          
//           if (provider) {
//             // Set the provider globally so wagmi can use it
//             if (typeof window !== 'undefined') {
//               (window as any).ethereum = provider
//             }
//           }
//         } catch (error) {
//           console.log("Farcaster provider not available:", error)
//         }
//       }

//       // Look for connectors in order of preference
//       const connectorPriority = [
//         // Farcaster-specific connectors
//         (c: any) => c.id === "farcasterMiniApp",
//         (c: any) => c.name?.toLowerCase().includes("farcaster"),
//         // Standard connectors
//         (c: any) => c.type === "injected" || c.id === "injected",
//         (c: any) => c.id === "metaMask",
//         (c: any) => c.id === "walletConnect",
//         // Fallback to any available connector
//         () => true
//       ]

//       let selectedConnector = null
      
//       for (const priorityFn of connectorPriority) {
//         selectedConnector = connectors.find(priorityFn)
//         if (selectedConnector) break
//       }

//       if (selectedConnector) {
//         console.log("Connecting with:", selectedConnector.name || selectedConnector.id)
//         await connect({ connector: selectedConnector })
//       } else {
//         throw new Error("No connectors available")
//       }

//     } catch (error) {
//       console.error("Connection failed:", error)
//       // Don't throw here, let wagmi handle the error state
//     }
//   }

//   if (isConnected) return null

//   return (
//     <div className="space-y-2">
//       <Button
//         onClick={handleConnect}
//         disabled={isPending}
//         className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl border-0 disabled:opacity-50 transition-all duration-200"
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

//       {error && (
//         <p className="text-red-400 text-sm text-center">
//           Connection failed. Please try again.
//         </p>
//       )}
//     </div>
//   )
// }




"use client"

import { useConnect, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"

// Safely import Farcaster SDK
let sdk: any = null
try {
  sdk = require("@farcaster/miniapp-sdk").sdk
} catch (error) {
  console.log("Farcaster SDK not available")
}

export function ConnectWallet() {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected } = useAccount()

  const handleConnect = async () => {
    try {
      // Check if we're in a Farcaster context and SDK is available
      const isInFarcaster = typeof window !== 'undefined' && 
                           window.parent !== window && 
                           sdk !== null

      if (isInFarcaster) {
        // Farcaster miniapp context
        try {
          const provider = await sdk.wallet.getEthereumProvider()
          
          if (provider && typeof window !== 'undefined') {
            (window as any).ethereum = provider
          }
        } catch (error) {
          console.log("Farcaster provider not available:", error)
        }

        // Look for Farcaster-specific connectors first
        const farcasterConnector = connectors.find(
          (connector) => 
            connector.id === "farcasterMiniApp" || 
            connector.name?.toLowerCase().includes("farcaster")
        )

        if (farcasterConnector) {
          await connect({ connector: farcasterConnector })
          return
        }
      }

      // Standard web context or fallback
      const connectorPriority = [
        // Standard injected wallet (MetaMask, etc.)
        (c: any) => c.type === "injected" || c.id === "injected",
        (c: any) => c.id === "metaMask",
        (c: any) => c.id === "walletConnect",
        (c: any) => c.id === "coinbaseWallet",
        // Any other connector
        () => true
      ]

      let selectedConnector = null
      
      for (const priorityFn of connectorPriority) {
        selectedConnector = connectors.find(priorityFn)
        if (selectedConnector) break
      }

      if (selectedConnector) {
        console.log("Connecting with:", selectedConnector.name || selectedConnector.id)
        await connect({ connector: selectedConnector })
      } else {
        throw new Error("No wallet connectors available")
      }

    } catch (error) {
      console.error("Connection failed:", error)
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