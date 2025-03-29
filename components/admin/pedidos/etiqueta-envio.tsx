"use client"

import { useState, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Printer, Download, Share2, MapPin, Store, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Barcode } from "@/components/ui/barcode"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import QRCode from "qrcode.react"
import { jsPDF } from "jspdf"

// Tipos
interface DireccionEnvio {
  calle: string
  numero: string
  piso?: string
  departamento?: string
  codigoPostal: string
  localidad: string
  provincia: string
  pais: string
  referencias?: string
  nombreDestinatario: string
  telefonoDestinatario: string
}

interface Paquete {
  peso: number
  alto: number
  ancho: number
  profundidad: number
}

interface EtiquetaEnvioProps {
  pedidoId: string
  numeroSeguimiento?: string
  direccion: DireccionEnvio
  paquete: Paquete
  fechaEnvio: Date
  fechaEstimadaEntrega?: Date
  estado: string
}

// Empresas de envío disponibles en Argentina
const empresasEnvio = [
  { id: "correo_argentino", nombre: "Correo Argentino", logo: "/logos/correo-argentino.svg" },
  { id: "oca", nombre: "OCA", logo: "/logos/oca.svg" },
  { id: "andreani", nombre: "Andreani", logo: "/logos/andreani.svg" },
  { id: "mercado_envios", nombre: "Mercado Envíos", logo: "/logos/mercado-envios.svg" },
  { id: "retiro_tienda", nombre: "Retiro en Tienda", logo: "/logos/store-pickup.svg" },
]

// Formatos de etiqueta disponibles
const formatosEtiqueta = [
  { id: "estandar", nombre: "Estándar (100mm x 150mm)" },
  { id: "compacto", nombre: "Compacto (80mm x 120mm)" },
]

export function EtiquetaEnvio({
  pedidoId,
  numeroSeguimiento = "AR" + Math.random().toString().substring(2, 11),
  direccion,
  paquete,
  fechaEnvio,
  fechaEstimadaEntrega,
  estado,
}: EtiquetaEnvioProps) {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("correo_argentino")
  const [formatoSeleccionado, setFormatoSeleccionado] = useState("estandar")
  const [mostrarPeso, setMostrarPeso] = useState(true)
  const [mostrarDimensiones, setMostrarDimensiones] = useState(true)
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true)

  const etiquetaRef = useRef<HTMLDivElement>(null)

  // Empresa de envío actual
  const empresaActual = empresasEnvio.find((e) => e.id === empresaSeleccionada)

  // Función para imprimir la etiqueta
  const handlePrint = useReactToPrint({
    content: () => etiquetaRef.current,
    documentTitle: `Etiqueta-${pedidoId}`,
    onAfterPrint: () => console.log("Impresión completada"),
  })

  // Función para descargar la etiqueta como PDF
  const handleDownload = () => {
    if (!etiquetaRef.current) return

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: formatoSeleccionado === "estandar" ? [100, 150] : [80, 120],
    })

    // Capturar el elemento como imagen y añadirlo al PDF
    const canvas = document.createElement("canvas")
    canvas.width = etiquetaRef.current.offsetWidth * 2
    canvas.height = etiquetaRef.current.offsetHeight * 2

    // Aquí normalmente usaríamos html2canvas, pero para simplificar
    pdf.text("Etiqueta de envío - " + pedidoId, 10, 10)
    pdf.save(`Etiqueta-${pedidoId}.pdf`)
  }

  // Función para compartir la etiqueta
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Etiqueta de envío - ${pedidoId}`,
          text: `Etiqueta de envío para el pedido ${pedidoId}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error al compartir:", error)
      }
    } else {
      // Fallback si Web Share API no está disponible
      alert("Compartir no está disponible en este navegador")
    }
  }

  // Datos para el código QR
  const qrData = JSON.stringify({
    pedidoId,
    numeroSeguimiento,
    direccion: {
      calle: direccion.calle,
      numero: direccion.numero,
      codigoPostal: direccion.codigoPostal,
      localidad: direccion.localidad,
      provincia: direccion.provincia,
    },
    fechaEnvio: fechaEnvio.toISOString(),
  })

  // Formatear fecha
  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Etiqueta de Envío</h2>
          <p className="text-muted-foreground">
            Personaliza y genera la etiqueta de envío para el pedido #{pedidoId.substring(0, 8)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Imprimir</span>
          </Button>

          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Descargar</span>
          </Button>

          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Compartir</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opciones de Etiqueta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="empresa-envio">Empresa de Envío</Label>
                <Select value={empresaSeleccionada} onValueChange={setEmpresaSeleccionada}>
                  <SelectTrigger id="empresa-envio">
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresasEnvio.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formato-etiqueta">Formato de Etiqueta</Label>
                <Select value={formatoSeleccionado} onValueChange={setFormatoSeleccionado}>
                  <SelectTrigger id="formato-etiqueta">
                    <SelectValue placeholder="Seleccionar formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatosEtiqueta.map((formato) => (
                      <SelectItem key={formato.id} value={formato.id}>
                        {formato.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mostrar-peso">Mostrar peso</Label>
                  <Switch id="mostrar-peso" checked={mostrarPeso} onCheckedChange={setMostrarPeso} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mostrar-dimensiones">Mostrar dimensiones</Label>
                  <Switch
                    id="mostrar-dimensiones"
                    checked={mostrarDimensiones}
                    onCheckedChange={setMostrarDimensiones}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mostrar-instrucciones">Mostrar instrucciones</Label>
                  <Switch
                    id="mostrar-instrucciones"
                    checked={mostrarInstrucciones}
                    onCheckedChange={setMostrarInstrucciones}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {empresaSeleccionada === "retiro_tienda" && (
            <Card>
              <CardHeader>
                <CardTitle>Opciones de Retiro en Tienda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sucursal">Sucursal de retiro</Label>
                  <Select defaultValue="central">
                    <SelectTrigger id="sucursal">
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="central">Sucursal Central</SelectItem>
                      <SelectItem value="norte">Sucursal Norte</SelectItem>
                      <SelectItem value="sur">Sucursal Sur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario">Horario de atención</Label>
                  <Select defaultValue="completo">
                    <SelectTrigger id="horario">
                      <SelectValue placeholder="Seleccionar horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completo">Lunes a Viernes 9-18hs</SelectItem>
                      <SelectItem value="manana">Lunes a Viernes 9-13hs</SelectItem>
                      <SelectItem value="tarde">Lunes a Viernes 13-18hs</SelectItem>
                      <SelectItem value="sabado">Sábados 9-13hs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="vista-previa">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vista-previa">Vista Previa</TabsTrigger>
              <TabsTrigger value="codigo-qr">Código QR</TabsTrigger>
            </TabsList>

            <TabsContent value="vista-previa" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div
                    ref={etiquetaRef}
                    className={`border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 mx-auto ${
                      formatoSeleccionado === "estandar" ? "w-[100mm] h-[150mm]" : "w-[80mm] h-[120mm]"
                    }`}
                  >
                    {/* Cabecera de la etiqueta */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs font-bold">{empresaActual?.nombre || "Empresa de Envío"}</div>
                      <div className="text-xs">{formatearFecha(fechaEnvio)}</div>
                    </div>

                    {/* Información principal */}
                    <div className="space-y-4">
                      {/* Número de seguimiento */}
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Número de seguimiento</div>
                        <div className="font-bold text-sm">{numeroSeguimiento}</div>
                        <div className="mt-1">
                          <Barcode value={numeroSeguimiento} height={30} displayValue={false} />
                        </div>
                      </div>

                      {/* Destinatario */}
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Destinatario:</div>
                        <div className="font-bold">{direccion.nombreDestinatario}</div>
                        <div className="text-xs">{direccion.telefonoDestinatario}</div>
                      </div>

                      {/* Dirección */}
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <div className="text-xs">
                          {direccion.calle} {direccion.numero}
                          {direccion.piso && `, Piso ${direccion.piso}`}
                          {direccion.departamento && `, Depto ${direccion.departamento}`}
                          <br />
                          {direccion.codigoPostal}, {direccion.localidad}
                          <br />
                          {direccion.provincia}, {direccion.pais}
                          {direccion.referencias && (
                            <>
                              <br />
                              <span className="italic">Ref: {direccion.referencias}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Información del paquete */}
                      {(mostrarPeso || mostrarDimensiones) && (
                        <div className="border-t border-dashed pt-2 text-xs">
                          <div className="flex justify-between">
                            {mostrarPeso && (
                              <div>
                                <span className="text-muted-foreground">Peso:</span> {paquete.peso} kg
                              </div>
                            )}
                            {mostrarDimensiones && (
                              <div>
                                <span className="text-muted-foreground">Dimensiones:</span> {paquete.alto}x
                                {paquete.ancho}x{paquete.profundidad} cm
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Instrucciones especiales */}
                      {mostrarInstrucciones && (
                        <div className="border-t border-dashed pt-2 text-xs">
                          <div className="text-muted-foreground mb-1">Instrucciones:</div>
                          <div>
                            {empresaSeleccionada === "retiro_tienda" ? (
                              <div className="flex items-center gap-1">
                                <Store className="h-3 w-3" />
                                <span>Retiro en tienda - Presentar DNI</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3" />
                                <span>Entregar en mano - No dejar con vecinos</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fecha estimada de entrega */}
                      {fechaEstimadaEntrega && (
                        <div className="text-xs text-center mt-2">
                          <span className="text-muted-foreground">Entrega estimada:</span>{" "}
                          {formatearFecha(fechaEstimadaEntrega)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="codigo-qr" className="mt-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <div className="mb-4">
                    <QRCode value={qrData} size={200} level="H" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Escanea este código QR para acceder a toda la información del envío
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

