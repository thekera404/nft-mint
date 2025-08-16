import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import "./globals.css"



const frameMetadata = {
  version: "next",
  imageUrl: "https://nftmint-henna.vercel.app/image.png",
  button: {
    title: "Mint NFT",
    action: {
      type: "launch_frame",
      name: "NFT MINT",
      url: "https://nftmint-henna.vercel.app/",
      splashImageUrl: "https://nftmint-henna.vercel.app/icon.png",
      splashBackgroundColor: "#4F46E5"
    }
  }
};

export const metadata: Metadata = {
  title: "NFT Mint - Farcaster Mini App",
  description: "Mint exclusive NFTs on Base network",
  // openGraph: {
  //   title: "NFT Mint - Farcaster Mini App",
  //   description: "Mint exclusive NFTs on Base network",
  //   images: "https://nftmint-henna.vercel.app/image.png",
  // },
  other: {
    "fc:frame": JSON.stringify(frameMetadata),
    "og:image": "https://iq-test-v1.vercel.app/image.png",
    "og:title": "IQ Test",
    "og:description": "Test your IQ and get instant results with CELO payment"





    // "fc:miniapp": JSON.stringify({
    //   version: "1", // Must be "1", not "1.0.0"
    //   imageUrl: "https://nftmint-henna.vercel.app/image.png", // 3:2 aspect ratio required
    //   button: {
    //     title: "Mint NFT", // Max 32 characters
    //     action: {
    //       type: "launch_frame",
    //       name: "NFT Mint",
    //       url: "https://nftmint-henna.vercel.app",
    //       splashImageUrl: "https://nftmint-henna.vercel.app/splash.png", // 200x200px
    //       splashBackgroundColor: "#6366F1",
    //     },
    //   },
    // }),
  }
};

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
  );
}
