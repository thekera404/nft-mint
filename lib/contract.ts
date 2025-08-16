// Replace these with your actual contract details
export const CONTRACT_ADDRESS = "0x..." as const // Your Base mainnet contract address

// Replace this with your actual contract ABI
export const CONTRACT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "quantity", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Add your complete contract ABI here
] as const
