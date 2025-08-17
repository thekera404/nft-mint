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
import { Wallet, Loader2, X, Check } from "lucide-react"
import { useEffect, useState } from "react"

export function ConnectWallet() {
  const { connectors, connect, isPending, error } = useConnect()
  const { isConnected } = useAccount()
  const [isFarcasterContext, setIsFarcasterContext] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connectingConnector, setConnectingConnector] = useState<string | null>(null)

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

  const handleConnect = () => {
    setShowWalletModal(true)
  }

  const handleWalletSelect = async (connector: any) => {
    try {
      setConnectingConnector(connector.id)
      await connect({ connector })
      setShowWalletModal(false)
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setConnectingConnector(null)
    }
  }

  const getWalletOptions = () => {
    if (isFarcasterContext) {
      // In Farcaster context, prioritize Farcaster wallet
      const farcasterConnector = connectors.find(
        (c) => c.name.toLowerCase().includes("farcaster") || c.id.includes("farcaster") || c.id.includes("miniapp"),
      )
      const injectedConnector = connectors.find(
        (c) => c.name.toLowerCase().includes("injected") || c.name.toLowerCase().includes("metamask"),
      )

      return [
        ...(farcasterConnector ? [{ ...farcasterConnector, displayName: "Farcaster Wallet", recommended: true }] : []),
        ...(injectedConnector ? [{ ...injectedConnector, displayName: "External Wallet", recommended: false }] : []),
      ]
    } else {
      // Outside Farcaster, prioritize MetaMask and other wallets
      return connectors.map((connector) => ({
        ...connector,
        displayName: connector.name === "Injected" ? "MetaMask" : connector.name,
        recommended:
          connector.name.toLowerCase().includes("metamask") || connector.name.toLowerCase().includes("injected"),
      }))
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

      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Choose preferred wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              {isFarcasterContext
                ? "This wallet will be used for transactions in miniapps. You can change it anytime in Settings."
                : "Choose your preferred wallet to connect and interact with the app."}
            </p>

            <div className="space-y-3">
              {getWalletOptions().map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleWalletSelect(connector)}
                  disabled={connectingConnector === connector.id}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600 disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{connector.displayName}</div>
                      {connector.recommended && <div className="text-xs text-green-400">Recommended</div>}
                    </div>
                  </div>

                  <div className="flex items-center">
                    {connectingConnector === connector.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    ) : connector.recommended ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
