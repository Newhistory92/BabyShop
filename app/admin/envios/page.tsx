import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfiguracionEnvios } from "@/components/admin/envios/configuracion-envios"
import { OpcionesCheckout } from "@/components/admin/envios/opciones-checkout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Store, Settings } from "lucide-react"

export default function EnviosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Envíos</h1>
        <p className="text-muted-foreground">Configura y administra las opciones de envío para tu tienda online</p>
      </div>

      <Tabs defaultValue="configuracion">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuracion">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="checkout">
            <Store className="h-4 w-4 mr-2" />
            Opciones de Checkout
          </TabsTrigger>
          <TabsTrigger value="etiquetas">
            <Truck className="h-4 w-4 mr-2" />
            Etiquetas de Envío
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracion" className="space-y-4 mt-4">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <ConfiguracionEnvios />
          </Suspense>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4 mt-4">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <OpcionesCheckout />
          </Suspense>
        </TabsContent>

        <TabsContent value="etiquetas" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas de Envío</CardTitle>
              <CardDescription>Genera e imprime etiquetas de envío para tus pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Para generar una etiqueta de envío, dirígete a la sección de pedidos y selecciona la opción
                &quot;Generar etiqueta&quot; en el pedido correspondiente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

