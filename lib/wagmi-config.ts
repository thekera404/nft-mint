// import { createConfig, http } from "wagmi"
// import { base } from "wagmi/chains"
// import { injected } from "wagmi/connectors"

// export const config = createConfig({
//   chains: [base],
//   connectors: [
//     injected({
//       target: "metaMask",
//     }),
//   ],
//   transports: {
//     [base.id]: http(),
//   },
// })


import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector"
import { injected, metaMask } from "wagmi/connectors"

export const config = createConfig({
  chains: [base],
  connectors: [
    miniAppConnector(),
    metaMask(),
    injected({ target: "metaMask" }),
    injected(), // Generic injected connector as final fallback
  ],
  transports: {
    [base.id]: http(),
  },
})










// import { http, createConfig } from 'wagmi'
// import { base } from 'wagmi/chains'
// import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
 
// export const config = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http(),
//   },
//   connectors: [
//     miniAppConnector()
//   ]
// })

// import { createConfig, http } from "wagmi"
// import { base } from "wagmi/chains"
// import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector"

// export const config = createConfig({
//   chains: [base],
//   connectors: [miniAppConnector()],
//   transports: {
//     [base.id]: http(),
//   },
// })

