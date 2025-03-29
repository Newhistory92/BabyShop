"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FormularioLogin } from "@/components/auth/formulario-login"
import { BotonGoogle } from "@/components/auth/boton-google"

export default function PaginaIniciarSesion() {
  const [tabActiva, setTabActiva] = useState<string>("login")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-gray-600 mt-2">Accede a tu cuenta para ver tus pedidos y más</p>
        </div>

        <Tabs value={tabActiva} onValueChange={setTabActiva}>
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="pt-6">
            <div className="space-y-6">
              {/* Botón de Google */}
              <BotonGoogle />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">O continúa con</span>
                </div>
              </div>

              {/* Formulario de login */}
              <FormularioLogin />

              <p className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  href={`/auth/asociate${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  Asóciate
                </Link>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

