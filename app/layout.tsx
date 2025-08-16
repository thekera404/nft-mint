import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import "./globals.css"

// Frame metadata (used for Farcaster frames)
const frameMetadata = {
  version: "next",
  imageUrl: "https://nftmint-henna.vercel.app/image.png", // must be 3:2 ratio
  button: {
    title: "Mint NFT",
    action: {
      type: "launch_frame",
      name: "NFT Mint",
      url: "https://nftmint-henna.vercel.app/",
      splashImageUrl: "https://nftmint-henna.vercel.app/splash.png", // wide splash image
      splashBackgroundColor: "#6366F1",
    },
  },
}

export const metadata: Metadata = {
  title: "NFT Mint - Farcaster Mini App",
  description: "Mint your exclusive NFT from the Based Nouns Club collection.",
  openGraph: {
    title: "NFT Mint - Farcaster Mini App",
    description: "Mint your exclusive NFT from the Based Nouns Club collection.",
    images: [
      {
        url: "https://nftmint-henna.vercel.app/og.png", // must be 1200x630
        width: 1200,
        height: 630,
        alt: "NFT Mint Preview",
      },
    ],
  },
  other: {
    // Frame embed
    "fc:frame": JSON.stringify(frameMetadata),

    // Mini App directory config
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://nftmint-henna.vercel.app/image.png", // 3:2 aspect ratio required
      button: {
        title: "Mint NFT",
        action: {
          type: "launch_frame",
          name: "NFT Mint",
          url: "https://nftmint-henna.vercel.app",
          splashImageUrl: "https://nftmint-henna.vercel.app/splash.png",
          splashBackgroundColor: "#6366F1",
        },
      },
    }),

    // Open Graph (redundant, but helps previews outside Farcaster)
    "og:image": "https://nftmint-henna.vercel.app/og.png",
    "og:title": "NFT Mint - Farcaster Mini App",
    "og:description": "Mint your exclusive NFT from the Based Nouns Club collection.",
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
