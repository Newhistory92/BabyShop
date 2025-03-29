import type React from "react"
import { SWRConfig } from "swr"

// Configuración global para SWR
export const swrConfig = {
  fetcher: async (url: string) => {
    const response = await fetch(url)

    if (!response.ok) {
      const error = new Error("Error en la petición API") as Error & { status?: number }
      error.status = response.status
      throw error
    }

    return response.json()
  },
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  shouldRetryOnError: true,
  errorRetryCount: 3,
}

// Componente proveedor de SWR
export function ProveedorSWR({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}

