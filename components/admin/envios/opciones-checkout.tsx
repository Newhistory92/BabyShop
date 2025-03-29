"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle \
} from
"@/components/ui/car
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Info, Truck, Store, Clock, MapPin } from "lucide-react"

// Tipos
interface OpcionEnvioCheckout {
  id: string
  nombre: string
  descripcion: string
  icono: "truck" | "store" | "clock"
  activo: boolean
  mensajePersonalizado?: string
}

// Datos de ejemplo
const opcionesEnvioIniciales: OpcionEnvioCheckout[] = [
  {
    id: "envio_domicilio",
    nombre: "Envío a domicilio",
    descripcion: "Recibe tu pedido en la comodidad de tu hogar",
    icono: "truck",
    activo: true,
    mensajePersonalizado: "¡Envío gratis en compras superiores a $15.000!",
  },
  {
    id: "retiro_tienda",
    nombre: "Retiro en tienda",
    descripcion: "Retira tu pedido en nuestras sucursales",
    icono: "store",
    activo: true,
    mensajePersonalizado: "Retiro sin costo adicional",
  },
  {
    id: "envio_express",
    nombre: "Envío express",
    descripcion: "Recibe tu pedido en menos de 24 horas",
    icono: "clock",
    activo: false,
    mensajePersonalizado: "Disponible solo para CABA y GBA",
  },
]

export function OpcionesCheckout() {
  const [opcionesEnvio, setOpcionesEnvio] = useState<OpcionEnvioCheckout[]>(opcionesEnvioIniciales)
  const [mensajeGeneral, setMensajeGeneral] = useState<string>(
    "Todos nuestros envíos incluyen seguimiento en tiempo real",
  )
  const [mostrarTiempoEstimado, setMostrarTiempoEstimado] = useState<boolean>(true)
  const [mostrarCostoEnvio, setMostrarCostoEnvio] = useState<boolean>(true)

  // Función para actualizar el estado de una opción
  const toggleOpcionActiva = (opcionId: string) => {
    setOpcionesEnvio(
      opcionesEnvio.map((opcion) => (opcion.id === opcionId ? { ...opcion, activo: !opcion.activo } : opcion)),
    )
  }

  // Función para actualizar el mensaje personalizado
  const actualizarMensajePersonalizado = (opcionId: string, mensaje: string) => {
    setOpcionesEnvio(
      opcionesEnvio.map((opcion) => (opcion.id === opcionId ? { ...opcion, mensajePersonalizado: mensaje } : opcion)),
    )
  }

  // Renderizar icono según tipo
  const renderizarIcono = (tipo: "truck" | "store" | "clock") => {
    switch (tipo) {
      case "truck":
        return <Truck className="h-5 w-5" />
      case "store":
        return <Store className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Opciones de Checkout</h2>
        <p className="text-muted-foreground">
          Personaliza las opciones de envío que verán tus clientes durante el proceso de compra
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opciones de Envío en Checkout</CardTitle>
          <CardDescription>Configura cómo se mostrarán las opciones de envío a tus clientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mostrar-tiempo" className="text-base">
                  Mostrar tiempo estimado
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar el tiempo estimado de entrega para cada opción de envío
                </p>
              </div>
              <Switch id="mostrar-tiempo" checked={mostrarTiempoEstimado} onCheckedChange={setMostrarTiempoEstimado} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mostrar-costo" className="text-base">
                  Mostrar costo de envío
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mostrar el costo de envío para cada opción durante el checkout
                </p>
              </div>
              <Switch id="mostrar-costo" checked={mostrarCostoEnvio} onCheckedChange={setMostrarCostoEnvio} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label htmlFor="mensaje-general">Mensaje general de envíos</Label>
            <Textarea
              id="mensaje-general"
              value={mensajeGeneral}
              onChange={(e) => setMensajeGeneral(e.target.value)}
              placeholder="Mensaje que se mostrará en la sección de envíos"
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Este mensaje se mostrará en la parte superior de la sección de envíos durante el checkout
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métodos de Envío Disponibles</CardTitle>
          <CardDescription>Configura los métodos de envío que estarán disponibles para tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Mensaje Personalizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opcionesEnvio.map((opcion) => (
                <TableRow key={opcion.id}>
                  <TableCell>
                    <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center text-primary">
                      {renderizarIcono(opcion.icono)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{opcion.nombre}</TableCell>
                  <TableCell>{opcion.descripcion}</TableCell>
                  <TableCell>
                    <Switch checked={opcion.activo} onCheckedChange={() => toggleOpcionActiva(opcion.id)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      value={opcion.mensajePersonalizado || ""}
                      onChange={(e) => actualizarMensajePersonalizado(opcion.id, e.target.value)}
                      placeholder="Mensaje personalizado (opcional)"
                      className="max-w-[300px] ml-auto"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            Los cambios se guardan automáticamente
          </div>
          <Button>
            <Check className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa del Checkout</CardTitle>
          <CardDescription>Así es como verán tus clientes las opciones de envío durante el checkout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-6 bg-card">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Opciones de envío</h3>
                {mensajeGeneral && (
                  <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <p>{mensajeGeneral}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {opcionesEnvio
                  .filter((opcion) => opcion.activo)
                  .map((opcion) => (
                    <div
                      key={opcion.id}
                      className="border rounded-md p-4 flex items-start gap-4 hover:bg-accent/50 cursor-pointer"
                    >
                      <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center text-primary flex-shrink-0">
                        {renderizarIcono(opcion.icono)}
                      </div>

                      <div className="flex-1">
                        <div className="font-medium">{opcion.nombre}</div>
                        <div className="text-sm text-muted-foreground">{opcion.descripcion}</div>

                        {opcion.mensajePersonalizado && (
                          <div className="mt-2 text-sm text-primary">{opcion.mensajePersonalizado}</div>
                        )}

                        {mostrarTiempoEstimado && (
                          <div className="mt-2 text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {opcion.icono === "truck"
                                ? "Entrega estimada: 3-5 días hábiles"
                                : opcion.icono === "store"
                                  ? "Disponible para retiro: 24hs después de la compra"
                                  : "Entrega en menos de 24hs"}
                            </span>
                          </div>
                        )}
                      </div>

                      {mostrarCostoEnvio && (
                        <div className="text-right flex-shrink-0">
                          {opcion.icono === "truck" ? (
                            <span className="font-medium">$1.200</span>
                          ) : opcion.icono === "store" ? (
                            <span className="text-green-600 dark:text-green-500 font-medium">Gratis</span>
                          ) : (
                            <span className="font-medium">$2.500</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

