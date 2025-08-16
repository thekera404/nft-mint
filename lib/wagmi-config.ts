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

export const config = createConfig({
  chains: [base],
  connectors: [miniAppConnector()],
  transports: {
    [base.id]: http(),
  },
})

