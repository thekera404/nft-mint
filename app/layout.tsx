import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "NFT Mint - Farcaster Mini App",
  description: "Mint exclusive NFTs on Base network",
  generator: "v0.app",
  openGraph: {
    title: "NFT Mint - Farcaster Mini App",
    description: "Mint exclusive NFTs on Base network",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || "https://nftmint-henna.vercel.app"}/image.png`],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1", // Must be "1", not "1.0.0"
      imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://nftmint-henna.vercel.app"}/image.png`, // 3:2 aspect ratio required
      button: {
        title: "Mint NFT", // Max 32 characters
        action: {
          type: "launch_frame",
          name: "NFT Mint",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://nftmint-henna.vercel.app",
          splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://nftmint-henna.vercel.app"}/splash.png`, // 200x200px
          splashBackgroundColor: "#6366F1",
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
