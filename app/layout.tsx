import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Proveedores } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CabeceraSitio } from "@/components/layout/cabecera-sitio"
import { PieSitio } from "@/components/layout/pie-sitio"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "BabyDream - Ropa para Bebés y Niños",
    template: "%s | BabyDream",
  },
  description:
    "Tienda online de ropa para bebés y niños con diseños exclusivos, materiales suaves y seguros para la piel sensible.",
  keywords: ["ropa bebé", "ropa niños", "ropa infantil", "algodón orgánico", "moda infantil", "ropa recién nacidos"],
  authors: [{ name: "BabyDream" }],
  creator: "BabyDream",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://babydream.vercel.app",
    title: "BabyDream - Ropa para Bebés y Niños",
    description:
      "Tienda online de ropa para bebés y niños con diseños exclusivos, materiales suaves y seguros para la piel sensible.",
    siteName: "BabyDream",
  },
  twitter: {
    card: "summary_large_image",
    title: "BabyDream - Ropa para Bebés y Niños",
    description:
      "Tienda online de ropa para bebés y niños con diseños exclusivos, materiales suaves y seguros para la piel sensible.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Proveedores>
          <CabeceraSitio />
          <main className="flex-1">{children}</main>
          <PieSitio />
          <Toaster />
        </Proveedores>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}



import './globals.css'