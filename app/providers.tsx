"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "@/lib/redux/store"
import { ProveedorSWR } from "@/hooks/useSWRConfig"
import { ProveedorCarrito } from "@/hooks/useCarrito"

export function Proveedores({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ProveedorSWR>
          <ThemeProvider attribute="class" defaultTheme="light">
            <ProveedorCarrito>{children}</ProveedorCarrito>
          </ThemeProvider>
        </ProveedorSWR>
      </ReduxProvider>
    </SessionProvider>
  )
}

