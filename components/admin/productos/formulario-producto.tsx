// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { Loader2, Plus, X } from "lucide-react"

// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useToast } from "@/components/ui/use-toast"
// import { VarianteProductoForm } from "@/components/admin/productos/variante-producto-form"
// import { ImagenProductoUpload } from "@/components/admin/productos/imagen-producto-upload"
// import { guardarProducto } from "@/acciones/admin/productos"
// import { obtenerCategorias } from "@/acciones/categorias"
// import { obtenerEtiquetasEco } from "@/acciones/productos"
// import type { Producto, VarianteProducto } from "@/types"

// // Esquema de validación
// const esquemaProducto = z.object({
//   nombre: z.string().min(1, "El nombre es requerido"),
//   descripcion: z.string().optional(),
//   precio: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
//   precioOriginal: z.coerce.number().optional(),
//   precioCompra: z.coerce.number().optional(),
//   stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
//   categoriaId: z.string().min(1, "La categoría es requerida"),
//   esNuevo: z.boolean().default(false),
//   etiquetasEco: z.array(z.string()).default([]),
//   modoUso: z.string().optional(),
//   ingredientes: z.string().optional(),
//   beneficios: z.array(z.string()).default([]),
// })

// type ValoresProducto = z.infer<typeof esquemaProducto>

// interface PropiedadesFormularioProducto {
//   producto?: Producto | null
// }

// export function FormularioProducto({ producto }: PropiedadesFormularioProducto) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [cargando, setCargando] = useState(false)
//   const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([])
//   const [etiquetasEco, setEtiquetasEco] = useState<string[]>([])
//   const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes || [])
//   const [variantes, setVariantes] = useState<VarianteProducto[]>(producto?.variantes || [])
//   const [nuevoBeneficio, setNuevoBeneficio] = useState("")

//   // Cargar categorías y etiquetas
//   useEffect(() => {
//     const cargarDatos = async () => {
//       try {
//         const categoriasData = await obtenerCategorias()
//         setCategorias(categoriasData)

//         const etiquetasData = await obtenerEtiquetasEco()
//         setEtiquetasEco(etiquetasData)
//       } catch (error) {
//         console.error("Error al cargar datos:", error)
//       }
//     }

//     cargarDatos()
//   }, [])

//   // Inicializar formulario
//   const form = useForm<ValoresProducto>({
//     resolver: zodResolver(esquemaProducto),
//     defaultValues: producto
//       ? {
//           nombre: producto.nombre,
//           descripcion: producto.descripcion || "",
//           precio: producto.precio,
//           precioOriginal: producto.precioOriginal || undefined,
//           precioCompra: producto.precioCompra || undefined,
//           stock: producto.stock,
//           categoriaId: producto.categoriaId,
//           esNuevo: producto.esNuevo,
//           etiquetasEco: producto.etiquetasEco || [],
//           modoUso: producto.modoUso || "",
//           ingredientes: producto.ingredientes || "",
//           beneficios: producto.beneficios || [],
//         }
//       : {
//           nombre: "",
//           descripcion: "",
//           precio: 0,
//           precioOriginal: undefined,
//           precioCompra: undefined,
//           stock: 0,
//           categoriaId: "",
//           esNuevo: false,
//           etiquetasEco: [],
//           modoUso: "",
//           ingredientes: "",
//           beneficios: [],
//         },
//   })

//   // Manejar envío del formulario
//   const manejarEnvio = async (valores: ValoresProducto) => {
//     setCargando(true)

//     try {
//       // Preparar datos del producto
//       const datosProducto = {
//         ...valores,
//         imagenes,
//         variantes,
//         id: producto?.id,
//       }

//       // Guardar producto
//       const productoGuardado = await guardarProducto(datosProducto)

//       toast({
//         title: producto ? "Producto actualizado" : "Producto creado",
//         description: producto
//           ? "El producto ha sido actualizado correctamente"
//           : "El producto ha sido creado correctamente",
//       })

//       // Redirigir a la lista de productos
//       router.push("/admin/productos")
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Ha ocurrido un error al guardar el producto",
//         variant: "destructive",
//       })
//     } finally {
//       setCargando(false)
//     }
//   }

//   // Manejar carga de imágenes
//   const manejarCargaImagen = (url: string) => {
//     setImagenes([...imagenes, url])
//   }

//   // Eliminar imagen
//   const eliminarImagen = (index: number) => {
//     const nuevasImagenes = [...imagenes]
//     nuevasImagenes.splice(index, 1)
//     setImagenes(nuevasImagenes)
//   }

//   // Agregar variante
//   const agregarVariante = (variante: VarianteProducto) => {
//     setVariantes([...variantes, variante])
//   }

//   // Actualizar variante
//   const actualizarVariante = (index: number, variante: VarianteProducto) => {
//     const nuevasVariantes = [...variantes]
//     nuevasVariantes[index] = variante
//     setVariantes(nuevasVariantes)
//   }

//   // Eliminar variante
//   const eliminarVariante = (index: number) => {
//     const nuevasVariantes = [...variantes]
//     nuevasVariantes.splice(index, 1)
//     setVariantes(nuevasVariantes)
//   }

//   // Agregar beneficio
//   const agregarBeneficio = () => {
//     if (!nuevoBeneficio.trim()) return

//     const beneficiosActuales = form.getValues("beneficios") || []
//     form.setValue("beneficios", [...beneficiosActuales, nuevoBeneficio])
//     setNuevoBeneficio("")
//   }

//   // Eliminar beneficio
//   const eliminarBeneficio = (index: number) => {
//     const beneficiosActuales = form.getValues("beneficios") || []
//     const nuevosBeneficios = [...beneficiosActuales]
//     nuevosBeneficios.splice(index, 1)
//     form.setValue("beneficios", nuevosBeneficios)
//   }

//   // Calcular ganancia
//   const calcularGanancia = () => {
//     const precio = form.getValues("precio") || 0
//     const precioCompra = form.getValues("precioCompra") || 0

//     if (precio <= 0 || precioCompra <= 0) return 0

//     const ganancia = precio - precioCompra
//     const porcentaje = (ganancia / precioCompra) * 100

//     return {
//       ganancia,
//       porcentaje: Math.round(porcentaje),
//     }
//   }

//   const ganancia = calcularGanancia()

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(manejarEnvio)} className="space-y-8">
//         <Tabs defaultValue="general" className="space-y-6">
//           <TabsList>
//             <TabsTrigger value="general">General</TabsTrigger>
//             <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
//             <TabsTrigger value="variantes">Variantes</TabsTrigger>
//             <TabsTrigger value="detalles">Detalles</TabsTrigger>
//             <TabsTrigger value="precios">Precios y Stock</TabsTrigger>
//           </TabsList>

//           {/* Pestaña General */}
//           <TabsContent value="general" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="nombre"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nombre del producto</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nombre del producto" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="categoriaId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Categoría</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Selecciona una categoría" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categorias.map((categoria) => (
//                           <SelectItem key={categoria.id} value={categoria.id}>
//                             {categoria.nombre}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="descripcion"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Descripción</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Descripción del producto" className="min-h-32" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="etiquetasEco"
//               render={() => (
//                 <FormItem>
//                   <div className="mb-4">
//                     <FormLabel>Etiquetas Eco</FormLabel>
//                     <FormDescription>Selecciona las etiquetas ecológicas que aplican a este producto</FormDescription>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {etiquetasEco.map((etiqueta) => (
//                       <FormField
//                         key={etiqueta}
//                         control={form.control}
//                         name="etiquetasEco"
//                         render={({ field }) => {
//                           return (
//                             <FormItem key={etiqueta} className="flex flex-row items-start space-x-2 space-y-0">
//                               <FormControl>
//                                 <Checkbox
//                                   checked={field.value?.includes(etiqueta)}
//                                   onCheckedChange={(checked) => {
//                                     return checked
//                                       ? field.onChange([...field.value, etiqueta])
//                                       : field.onChange(field.value?.filter((value) => value !== etiqueta))
//                                   }}
//                                 />
//                               </FormControl>
//                               <FormLabel className="text-sm font-normal">{etiqueta}</FormLabel>
//                             </FormItem>
//                           )
//                         }}
//                       />
//                     ))}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="esNuevo"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                   <FormControl>
//                     <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>Marcar como nuevo</FormLabel>
//                     <FormDescription>Este producto aparecerá con la etiqueta "Nuevo" en la tienda</FormDescription>
//                   </div>
//                 </FormItem>
//               )}
//             />
//           </TabsContent>

//           {/* Pestaña Imágenes */}
//           <TabsContent value="imagenes" className="space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium">Imágenes del producto</h3>
//                 <p className="text-sm text-muted-foreground">Agrega imágenes para mostrar el producto en la tienda</p>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {imagenes.map((imagen, index) => (
//                   <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
//                     <img
//                       src={imagen || "/placeholder.svg"}
//                       alt={`Imagen ${index + 1}`}
//                       className="object-cover w-full h-full"
//                     />
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-2 right-2 h-6 w-6"
//                       onClick={() => eliminarImagen(index)}
//                       type="button"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}

//                 <ImagenProductoUpload onImagenCargada={manejarCargaImagen} />
//               </div>
//             </div>
//           </TabsContent>

//           {/* Pestaña Variantes */}
//           <TabsContent value="variantes" className="space-y-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium">Variantes del producto</h3>
//                 <p className="text-sm text-muted-foreground">Agrega variantes como tamaños, colores, etc.</p>
//               </div>

//               {variantes.length > 0 && (
//                 <div className="space-y-4">
//                   {variantes.map((variante, index) => (
//                     <Card key={index}>
//                       <CardContent className="pt-6">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <h4 className="font-medium">{variante.nombre}</h4>
//                             <p className="text-sm text-muted-foreground">
//                               Precio: ${variante.precio} - Stock: {variante.stock}
//                             </p>
//                           </div>
//                           <div className="flex gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 const varianteActualizada = { ...variante }
//                                 actualizarVariante(index, varianteActualizada)
//                               }}
//                               type="button"
//                             >
//                               Editar
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => eliminarVariante(index)}
//                               type="button"
//                             >
//                               Eliminar
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}

//               <VarianteProductoForm onAgregarVariante={agregarVariante} />
//             </div>
//           </TabsContent>

//           {/* Pestaña Detalles */}
//           <TabsContent value="detalles" className="space-y-6">
//             <FormField
//               control={form.control}
//               name="modoUso"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Modo de uso</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Instrucciones de uso del producto" className="min-h-24" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="ingredientes"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Ingredientes</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Lista de ingredientes del producto" className="min-h-24" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="space-y-4">
//               <FormLabel>Beneficios</FormLabel>
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Agregar un beneficio"
//                   value={nuevoBeneficio}
//                   onChange={(e) => setNuevoBeneficio(e.target.value)}
//                 />
//                 <Button type="button" onClick={agregarBeneficio} disabled={!nuevoBeneficio.trim()}>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Agregar
//                 </Button>
//               </div>

//               <div className="space-y-2">
//                 {form.watch("beneficios")?.map((beneficio, index) => (
//                   <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
//                     <span>{beneficio}</span>
//                     <Button variant="ghost" size="icon" onClick={() => eliminarBeneficio(index)} type="button">
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </TabsContent>

//           {/* Pestaña Precios y Stock */}
//           <TabsContent value="precios" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <FormField
//                 control={form.control}
//                 name="precio"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Precio de venta ($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="precioOriginal"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Precio original ($)</FormLabel>
//                     <FormDescription>Opcional, para mostrar descuentos</FormDescription>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} value={field.value || ""} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="precioCompra"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Precio de compra ($)</FormLabel>
//                     <FormDescription>Para calcular márgenes</FormDescription>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} value={field.value || ""} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {form.watch("precioCompra") > 0 && form.watch("precio") > 0 && (
//               <Card>
//                 <CardContent className="pt-6">
//                   <h3 className="font-medium mb-2">Análisis de rentabilidad</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Ganancia por unidad</p>
//                       <p className="text-lg font-medium">${ganancia.ganancia}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Margen de ganancia</p>
//                       <p className="text-lg font-medium">
//                         {ganancia.porcentaje}%
//                         <Badge
//                           className={`ml-2 ${
//                             ganancia.porcentaje < 20
//                               ? "bg-red-500"
//                               : ganancia.porcentaje < 40
//                                 ? "bg-yellow-500"
//                                 : "bg-green-500"
//                           }`}
//                         >
//                           {ganancia.porcentaje < 20 ? "Bajo" : ganancia.porcentaje < 40 ? "Medio" : "Alto"}
//                         </Badge>
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Separator />

//             <FormField
//               control={form.control}
//               name="stock"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Stock disponible</FormLabel>
//                   <FormControl>
//                     <Input type="number" min="0" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-end gap-4">
//           <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")} disabled={cargando}>
//             Cancelar
//           </Button>
//           <Button type="submit" disabled={cargando}>
//             {cargando ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {producto ? "Actualizando..." : "Creando..."}
//               </>
//             ) : producto ? (
//               "Actualizar Producto"
//             ) : (
//               "Crear Producto"
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2, Plus, Save, Loader2, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

import { VarianteProductoForm } from "./variante-producto-form"
import { ImagenProductoUpload } from "./imagen-producto-upload"
import type { Producto, Categoria, VarianteProducto, VarianteColor } from "@/types"

// Esquema de validación para el formulario
const esquemaProducto = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
  categoriaId: z.string().min(1, "Debes seleccionar una categoría"),
  esNuevo: z.boolean().default(false),
  etiquetasEco: z.array(z.string()).optional(),
})

type ValoresFormulario = z.infer<typeof esquemaProducto>

interface PropiedadesFormularioProducto {
  producto?: Producto
  categorias: Categoria[]
  onSubmit: (datos: any) => Promise<void>
}

export function FormularioProducto({ producto, categorias, onSubmit }: PropiedadesFormularioProducto) {
  const [cargando, setCargando] = useState(false)
  const [variantes, setVariantes] = useState<VarianteProducto[]>(producto?.variantes || [])
  const [variantesColor, setVariantesColor] = useState<VarianteColor[]>(producto?.variantesColor || [])
  const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes || [])
  const [etiquetaInput, setEtiquetaInput] = useState("")
  const [etiquetas, setEtiquetas] = useState<string[]>(producto?.etiquetasEco || [])
  const [activeTab, setActiveTab] = useState("general")

  // Inicializar el formulario
  const form = useForm<ValoresFormulario>({
    resolver: zodResolver(esquemaProducto),
    defaultValues: {
      nombre: producto?.nombre || "",
      descripcion: producto?.descripcion || "",
      precio: producto?.precio || 0,
      stock: producto?.stock || 0,
      categoriaId: producto?.categoriaId || "",
      esNuevo: producto?.esNuevo || false,
      etiquetasEco: producto?.etiquetasEco || [],
    },
  })

  // Manejar envío del formulario
  const handleSubmit = async (data: ValoresFormulario) => {
    setCargando(true)
    try {
      // Combinar datos del formulario con variantes e imágenes
      const datosCompletos = {
        ...data,
        variantes,
        variantesColor,
        imagenes,
        etiquetasEco: etiquetas,
      }

      await onSubmit(datosCompletos)
      toast({
        title: "Producto guardado",
        description: "El producto se ha guardado correctamente",
      })
    } catch (error) {
      console.error("Error al guardar el producto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el producto",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  // Manejar agregar etiqueta
  const agregarEtiqueta = () => {
    if (etiquetaInput.trim() && !etiquetas.includes(etiquetaInput.trim())) {
      setEtiquetas([...etiquetas, etiquetaInput.trim()])
      setEtiquetaInput("")
    }
  }

  // Manejar eliminar etiqueta
  const eliminarEtiqueta = (etiqueta: string) => {
    setEtiquetas(etiquetas.filter((e) => e !== etiqueta))
  }

  // Manejar agregar variante de color
  const agregarVarianteColor = () => {
    const nuevaVariante: VarianteColor = {
      id: `temp-${Date.now()}`,
      codigo: "#FFFFFF",
      nombre: "Nuevo color",
      imagen: imagenes[0] || "/placeholder.svg",
    }
    setVariantesColor([...variantesColor, nuevaVariante])
  }

  // Manejar actualizar variante de color
  const actualizarVarianteColor = (id: string, datos: Partial<VarianteColor>) => {
    setVariantesColor(variantesColor.map((v) => (v.id === id ? { ...v, ...datos } : v)))
  }

  // Manejar eliminar variante de color
  const eliminarVarianteColor = (id: string) => {
    setVariantesColor(variantesColor.filter((v) => v.id !== id))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
            <TabsTrigger value="variantes">Variantes</TabsTrigger>
            <TabsTrigger value="colores">Colores</TabsTrigger>
          </TabsList>

          {/* Pestaña General */}
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del producto" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="esNuevo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Marcar como nuevo</FormLabel>
                    <FormDescription>Este producto se mostrará con la etiqueta "Nuevo"</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Etiquetas ecológicas</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {etiquetas.map((etiqueta) => (
                  <Badge key={etiqueta} variant="outline" className="flex items-center gap-1">
                    {etiqueta}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => eliminarEtiqueta(etiqueta)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={etiquetaInput}
                  onChange={(e) => setEtiquetaInput(e.target.value)}
                  placeholder="Agregar etiqueta"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarEtiqueta())}
                />
                <Button type="button" onClick={agregarEtiqueta} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Pestaña Imágenes */}
          <TabsContent value="imagenes" className="space-y-4 pt-4">
            <ImagenProductoUpload imagenes={imagenes} setImagenes={setImagenes} maxImagenes={6} />
          </TabsContent>

          {/* Pestaña Variantes */}
          <TabsContent value="variantes" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Variantes del producto</h3>
                <Button
                  type="button"
                  onClick={() =>
                    setVariantes([
                      ...variantes,
                      {
                        id: `temp-${Date.now()}`,
                        nombre: "",
                        precio: form.getValues("precio"),
                        productoId: producto?.id || "",
                        stock: form.getValues("stock"),
                      },
                    ])
                  }
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar variante
                </Button>
              </div>

              {variantes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay variantes. Agrega una variante para este producto.
                </div>
              ) : (
                <div className="space-y-4">
                  {variantes.map((variante, index) => (
                    <VarianteProductoForm
                      key={variante.id}
                      variante={variante}
                      onUpdate={(datos) => {
                        const nuevasVariantes = [...variantes]
                        nuevasVariantes[index] = { ...nuevasVariantes[index], ...datos }
                        setVariantes(nuevasVariantes)
                      }}
                      onDelete={() => {
                        setVariantes(variantes.filter((_, i) => i !== index))
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pestaña Colores */}
          <TabsContent value="colores" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Variantes de color</h3>
                <Button type="button" onClick={agregarVarianteColor} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar color
                </Button>
              </div>

              {variantesColor.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay colores. Agrega colores para mostrar diferentes variantes del producto.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variantesColor.map((variante) => (
                    <Card key={variante.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: variante.codigo }} />
                            <Input
                              value={variante.nombre}
                              onChange={(e) => actualizarVarianteColor(variante.id!, { nombre: e.target.value })}
                              className="h-8 w-40"
                              placeholder="Nombre del color"
                            />
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => eliminarVarianteColor(variante.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FormLabel className="text-xs">Código de color</FormLabel>
                            <Input
                              type="color"
                              value={variante.codigo}
                              onChange={(e) => actualizarVarianteColor(variante.id!, { codigo: e.target.value })}
                              className="h-8"
                            />
                          </div>
                          <div className="relative">
                            <FormLabel className="text-xs">Imagen</FormLabel>
                            <Select
                              value={variante.imagen}
                              onValueChange={(valor) => actualizarVarianteColor(variante.id!, { imagen: valor })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Seleccionar imagen" />
                              </SelectTrigger>
                              <SelectContent>
                                {imagenes.length > 0 ? (
                                  imagenes.map((img, idx) => (
                                    <SelectItem key={idx} value={img}>
                                      Imagen {idx + 1}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="/placeholder.svg">Sin imágenes</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="relative h-24 w-full bg-gray-100 rounded-md overflow-hidden">
                          {variante.imagen ? (
                            <Image
                              src={variante.imagen || "/placeholder.svg"}
                              alt={variante.nombre}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={cargando}>
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar producto
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
