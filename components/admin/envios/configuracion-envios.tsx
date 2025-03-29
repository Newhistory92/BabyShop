"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Edit, Save, X, MapPin, Truck, Store, Info } from "lucide-react"

// Tipos
interface ZonaEnvio {
  id: string
  nombre: string
  provincias: string[]
  costoBase: number
  costoAdicionalPorKg: number
  tiempoEstimadoEntrega: string
}

interface EmpresaEnvio {
  id: string
  nombre: string
  logo?: string
  activo: boolean
  zonas: ZonaEnvio[]
  requiereCredenciales: boolean
  credenciales?: {
    apiKey?: string
    usuarioId?: string
    contrasena?: string
  }
}

interface OpcionRetiroTienda {
  id: string
  nombre: string
  direccion: string
  horario: string
  activo: boolean
}

// Datos de ejemplo
const empresasEnvioIniciales: EmpresaEnvio[] = [
  {
    id: "correo_argentino",
    nombre: "Correo Argentino",
    logo: "/logos/correo-argentino.svg",
    activo: true,
    requiereCredenciales: true,
    zonas: [
      {
        id: "amba",
        nombre: "AMBA",
        provincias: ["Capital Federal", "GBA"],
        costoBase: 800,
        costoAdicionalPorKg: 200,
        tiempoEstimadoEntrega: "2-3 días hábiles",
      },
      {
        id: "interior",
        nombre: "Interior",
        provincias: ["Buenos Aires (interior)", "Córdoba", "Santa Fe", "Mendoza"],
        costoBase: 1200,
        costoAdicionalPorKg: 300,
        tiempoEstimadoEntrega: "3-5 días hábiles",
      },
    ],
  },
  {
    id: "oca",
    nombre: "OCA",
    logo: "/logos/oca.svg",
    activo: false,
    requiereCredenciales: true,
    zonas: [
      {
        id: "amba",
        nombre: "AMBA",
        provincias: ["Capital Federal", "GBA"],
        costoBase: 900,
        costoAdicionalPorKg: 250,
        tiempoEstimadoEntrega: "1-2 días hábiles",
      },
      {
        id: "interior",
        nombre: "Interior",
        provincias: ["Buenos Aires (interior)", "Córdoba", "Santa Fe", "Mendoza"],
        costoBase: 1300,
        costoAdicionalPorKg: 350,
        tiempoEstimadoEntrega: "2-4 días hábiles",
      },
    ],
  },
]

const opcionesRetiroIniciales: OpcionRetiroTienda[] = [
  {
    id: "sucursal_central",
    nombre: "Sucursal Central",
    direccion: "Av. Corrientes 1234, CABA",
    horario: "Lunes a Viernes de 9 a 18hs",
    activo: true,
  },
  {
    id: "sucursal_norte",
    nombre: "Sucursal Norte",
    direccion: "Av. Cabildo 4567, CABA",
    horario: "Lunes a Viernes de 10 a 19hs, Sábados de 10 a 14hs",
    activo: true,
  },
]

export function ConfiguracionEnvios() {
  const [empresasEnvio, setEmpresasEnvio] = useState<EmpresaEnvio[]>(empresasEnvioIniciales)
  const [opcionesRetiro, setOpcionesRetiro] = useState<OpcionRetiroTienda[]>(opcionesRetiroIniciales)
  const [envioGratis, setEnvioGratis] = useState(true)
  const [montoMinimoEnvioGratis, setMontoMinimoEnvioGratis] = useState(15000)

  // Estado para edición
  const [editandoZona, setEditandoZona] = useState<string | null>(null)
  const [editandoRetiro, setEditandoRetiro] = useState<string | null>(null)

  // Función para actualizar el estado de una empresa
  const toggleEmpresaActiva = (empresaId: string) => {
    setEmpresasEnvio(
      empresasEnvio.map((empresa) => (empresa.id === empresaId ? { ...empresa, activo: !empresa.activo } : empresa)),
    )
  }

  // Función para actualizar el estado de una opción de retiro
  const toggleRetiroActivo = (retiroId: string) => {
    setOpcionesRetiro(
      opcionesRetiro.map((opcion) => (opcion.id === retiroId ? { ...opcion, activo: !opcion.activo } : opcion)),
    )
  }

  // Función para guardar cambios en una zona
  const guardarCambiosZona = (empresaId: string, zonaId: string, datos: Partial<ZonaEnvio>) => {
    setEmpresasEnvio(
      empresasEnvio.map((empresa) =>
        empresa.id === empresaId
          ? {
              ...empresa,
              zonas: empresa.zonas.map((zona) => (zona.id === zonaId ? { ...zona, ...datos } : zona)),
            }
          : empresa,
      ),
    )
    setEditandoZona(null)
  }

  // Función para guardar cambios en una opción de retiro
  const guardarCambiosRetiro = (retiroId: string, datos: Partial<OpcionRetiroTienda>) => {
    setOpcionesRetiro(opcionesRetiro.map((opcion) => (opcion.id === retiroId ? { ...opcion, ...datos } : opcion)))
    setEditandoRetiro(null)
  }

  // Función para eliminar una opción de retiro
  const eliminarOpcionRetiro = (retiroId: string) => {
    setOpcionesRetiro(opcionesRetiro.filter((opcion) => opcion.id !== retiroId))
  }

  // Función para añadir una nueva opción de retiro
  const agregarOpcionRetiro = () => {
    const nuevaOpcion: OpcionRetiroTienda = {
      id: `sucursal_${Date.now()}`,
      nombre: "Nueva Sucursal",
      direccion: "",
      horario: "",
      activo: true,
    }
    setOpcionesRetiro([...opcionesRetiro, nuevaOpcion])
    setEditandoRetiro(nuevaOpcion.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración de Envíos</h2>
        <p className="text-muted-foreground">Configura las opciones de envío para tu tienda online</p>
      </div>

      <Tabs defaultValue="empresas">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="empresas">
            <Truck className="h-4 w-4 mr-2" />
            Empresas de Envío
          </TabsTrigger>
          <TabsTrigger value="retiro">
            <Store className="h-4 w-4 mr-2" />
            Retiro en Tienda
          </TabsTrigger>
          <TabsTrigger value="general">
            <MapPin className="h-4 w-4 mr-2" />
            Configuración General
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Empresas de Envío */}
        <TabsContent value="empresas" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Empresas de Envío Disponibles</CardTitle>
              <CardDescription>Configura las empresas de envío que utilizarás para tus pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {empresasEnvio.map((empresa) => (
                  <AccordionItem key={empresa.id} value={empresa.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                            {empresa.logo ? (
                              <img
                                src={empresa.logo || "/placeholder.svg"}
                                alt={empresa.nombre}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <Truck className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <span>{empresa.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={empresa.activo}
                            onCheckedChange={() => toggleEmpresaActiva(empresa.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {empresa.requiereCredenciales && (
                        <div className="mb-6 space-y-4">
                          <h4 className="font-medium">Credenciales API</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${empresa.id}-api-key`}>API Key</Label>
                              <Input
                                id={`${empresa.id}-api-key`}
                                type="password"
                                placeholder="Ingresa tu API Key"
                                defaultValue={empresa.credenciales?.apiKey || ""}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${empresa.id}-usuario`}>Usuario</Label>
                              <Input
                                id={`${empresa.id}-usuario`}
                                placeholder="Usuario o ID de cuenta"
                                defaultValue={empresa.credenciales?.usuarioId || ""}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm">Guardar Credenciales</Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="font-medium">Zonas de Envío</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Zona</TableHead>
                              <TableHead>Costo Base</TableHead>
                              <TableHead>Adicional por Kg</TableHead>
                              <TableHead>Tiempo Estimado</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {empresa.zonas.map((zona) => (
                              <TableRow key={zona.id}>
                                <TableCell className="font-medium">{zona.nombre}</TableCell>
                                <TableCell>
                                  {editandoZona === `${empresa.id}-${zona.id}` ? (
                                    <Input
                                      type="number"
                                      defaultValue={zona.costoBase}
                                      className="w-24"
                                      onChange={(e) => {
                                        const valor = Number.parseInt(e.target.value)
                                        if (!isNaN(valor)) {
                                          guardarCambiosZona(empresa.id, zona.id, { costoBase: valor })
                                        }
                                      }}
                                    />
                                  ) : (
                                    `$${zona.costoBase}`
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editandoZona === `${empresa.id}-${zona.id}` ? (
                                    <Input
                                      type="number"
                                      defaultValue={zona.costoAdicionalPorKg}
                                      className="w-24"
                                      onChange={(e) => {
                                        const valor = Number.parseInt(e.target.value)
                                        if (!isNaN(valor)) {
                                          guardarCambiosZona(empresa.id, zona.id, { costoAdicionalPorKg: valor })
                                        }
                                      }}
                                    />
                                  ) : (
                                    `$${zona.costoAdicionalPorKg}`
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editandoZona === `${empresa.id}-${zona.id}` ? (
                                    <Input
                                      defaultValue={zona.tiempoEstimadoEntrega}
                                      className="w-36"
                                      onChange={(e) => {
                                        guardarCambiosZona(empresa.id, zona.id, {
                                          tiempoEstimadoEntrega: e.target.value,
                                        })
                                      }}
                                    />
                                  ) : (
                                    zona.tiempoEstimadoEntrega
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {editandoZona === `${empresa.id}-${zona.id}` ? (
                                    <div className="flex justify-end gap-2">
                                      <Button size="icon" variant="ghost" onClick={() => setEditandoZona(null)}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                      <Button size="icon" variant="ghost" onClick={() => setEditandoZona(null)}>
                                        <Save className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => setEditandoZona(`${empresa.id}-${zona.id}`)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Retiro en Tienda */}
        <TabsContent value="retiro" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Puntos de Retiro</CardTitle>
                <CardDescription>
                  Configura las sucursales donde los clientes pueden retirar sus pedidos
                </CardDescription>
              </div>
              <Button onClick={agregarOpcionRetiro}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Sucursal
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opcionesRetiro.map((opcion) => (
                    <TableRow key={opcion.id}>
                      <TableCell className="font-medium">
                        {editandoRetiro === opcion.id ? (
                          <Input
                            defaultValue={opcion.nombre}
                            onChange={(e) => {
                              guardarCambiosRetiro(opcion.id, { nombre: e.target.value })
                            }}
                          />
                        ) : (
                          opcion.nombre
                        )}
                      </TableCell>
                      <TableCell>
                        {editandoRetiro === opcion.id ? (
                          <Input
                            defaultValue={opcion.direccion}
                            onChange={(e) => {
                              guardarCambiosRetiro(opcion.id, { direccion: e.target.value })
                            }}
                          />
                        ) : (
                          opcion.direccion
                        )}
                      </TableCell>
                      <TableCell>
                        {editandoRetiro === opcion.id ? (
                          <Input
                            defaultValue={opcion.horario}
                            onChange={(e) => {
                              guardarCambiosRetiro(opcion.id, { horario: e.target.value })
                            }}
                          />
                        ) : (
                          opcion.horario
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={opcion.activo} onCheckedChange={() => toggleRetiroActivo(opcion.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        {editandoRetiro === opcion.id ? (
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => setEditandoRetiro(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditandoRetiro(null)}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" onClick={() => setEditandoRetiro(opcion.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente este punto de retiro
                                    de tu tienda.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => eliminarOpcionRetiro(opcion.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Configuración General */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General de Envíos</CardTitle>
              <CardDescription>Configura las opciones generales para los envíos de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="envio-gratis" className="text-base">
                      Envío gratis
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ofrecer envío gratis a partir de un monto mínimo de compra
                    </p>
                  </div>
                  <Switch id="envio-gratis" checked={envioGratis} onCheckedChange={setEnvioGratis} />
                </div>

                {envioGratis && (
                  <div className="space-y-2 pl-6 border-l-2 border-muted">
                    <Label htmlFor="monto-minimo">Monto mínimo para envío gratis</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        id="monto-minimo"
                        type="number"
                        value={montoMinimoEnvioGratis}
                        onChange={(e) => {
                          const valor = Number.parseInt(e.target.value)
                          if (!isNaN(valor)) {
                            setMontoMinimoEnvioGratis(valor)
                          }
                        }}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mostrar-tiempo-entrega" className="text-base">
                      Mostrar tiempo estimado de entrega
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar al cliente el tiempo estimado de entrega durante el checkout
                    </p>
                  </div>
                  <Switch id="mostrar-tiempo-entrega" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="calcular-peso" className="text-base">
                      Calcular costo por peso
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Calcular el costo de envío según el peso total del carrito
                    </p>
                  </div>
                  <Switch id="calcular-peso" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-md flex gap-3">
                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Consejo:</p>
                  <p>
                    Ofrecer envío gratis a partir de cierto monto puede aumentar el valor promedio de tus ventas. Según
                    estudios, el 93% de los compradores online están más dispuestos a comprar si el envío es gratis.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Guardar Configuración</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

