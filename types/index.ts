// Archivo central de tipos para toda la aplicación

// Tipos de autenticación
export interface Usuario {
  id: string
  nombre: string | null
  email: string | null
  imagen: string | null
  creado: Date
  actualizado: Date
}

export interface SesionUsuario {
  usuario: {
    id: string
    nombre: string | null
    email: string | null
    imagen: string | null
  }
  expira: string
}

// Tipos de productos
export interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  precioOriginal?: number
  imagenes: string[]
  categoriaId: string
  stock: number
  esNuevo: boolean
  calificacion: number | null
  cantidadResenas: number
  creado: Date
  actualizado: Date
  categoria?: Categoria
  variantes?: VarianteProducto[]
  variantesColor?: VarianteColor[]
  etiquetasEco?: string[]
  resenas?: Resena[]
}

export interface VarianteProducto {
  id: string
  nombre: string
  precio: number
  productoId: string
  stock: number
  seleccionado?: boolean
}

export interface VarianteColor {
  id?: string
  codigo: string
  nombre: string
  imagen: string
  productoId?: string
}

export interface Categoria {
  id: string
  nombre: string
  imagen: string | null
  cantidadProductos?: number
}

export interface EtiquetaEco {
  id: string
  nombre: string
}

export interface Resena {
  id: string
  calificacion: number
  comentario: string | null
  productoId: string
  usuarioId: string
  nombreUsuario: string
  imagenUsuario: string | null
  creado: Date
}

// Tipos de carrito
export interface ElementoCarrito {
  id: string
  nombre: string
  precio: number
  imagen: string
  cantidad: number
  variante?: string
  varianteId?: string
  color?: string
}

export interface EstadoCarrito {
  elementos: ElementoCarrito[]
  estaAbierto: boolean
}

// Tipos de pedidos
export type EstadoPedido = "PENDIENTE" | "PROCESANDO" | "ENVIADO" | "ENTREGADO" | "CANCELADO"

export interface Pedido {
  id: string
  usuarioId: string
  estado: EstadoPedido
  total: number
  costoEnvio: number
  descuento: number
  metodoPago: string | null
  idPago: string | null
  direccionId: string | null
  creado: Date
  actualizado: Date
  elementosPedido: ElementoPedido[]
  direccion?: Direccion
}

export interface ElementoPedido {
  id: string
  pedidoId: string
  productoId: string
  varianteProductoId: string | null
  colorSeleccionado: string | null
  cantidad: number
  precio: number
}

// Tipos de direcciones
export interface Direccion {
  id: string
  usuarioId: string
  nombre: string
  calle: string
  numero: string
  departamento: string | null
  ciudad: string
  provincia: string
  codigoPostal: string
  pais: string
  telefono: string
  esPrincipal: boolean
}

// Tipos para favoritos
export interface ElementoFavorito {
  id: string
  usuarioId: string
  productoId: string
  creado: Date
  producto?: Producto
}

// Tipos para filtros y ordenamiento
export interface FiltrosProducto {
  categoria?: string
  etiquetaEco?: string[]
  precioMin?: number
  precioMax?: number
  busqueda?: string
  pagina: number
  limite: number
  ordenar: OrdenProducto
}

export type OrdenProducto =
  | "destacados"
  | "precio-asc"
  | "precio-desc"
  | "nombre-asc"
  | "nombre-desc"
  | "nuevos"
  | "calificacion"

// Tipos para respuestas paginadas
export interface RespuestaPaginada<T> {
  datos: T[]
  paginacion: {
    total: number
    pagina: number
    limite: number
    totalPaginas: number
  }
}

// Tipos para checkout
export interface DatosPago {
  elementos: ElementoCarrito[]
  direccionEnvioId: string
}

export interface RespuestaPago {
  url?: string
  id?: string
  punto_inicio?: string
  error?: string
}

// Tipos para notificaciones
export interface Notificacion {
  id: string
  tipo: "exito" | "error" | "info" | "advertencia"
  mensaje: string
  duracion?: number
}

// Tipos para optimistic updates
export interface ActualizacionOptimista<T> {
  datos: T
  accion: "crear" | "actualizar" | "eliminar"
}

