import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verificarAutenticacion } from "@/lib/auth/verificarAutenticacion"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const categoria = searchParams.get("categoria")
  const etiquetasEco = searchParams.getAll("etiquetaEco")
  const precioMin = searchParams.get("precioMin") ? Number.parseInt(searchParams.get("precioMin")!) : undefined
  const precioMax = searchParams.get("precioMax") ? Number.parseInt(searchParams.get("precioMax")!) : undefined
  const busqueda = searchParams.get("busqueda")
  const pagina = searchParams.get("pagina") ? Number.parseInt(searchParams.get("pagina")!) : 1
  const limite = searchParams.get("limite") ? Number.parseInt(searchParams.get("limite")!) : 12
  const ordenar = searchParams.get("ordenar") || "destacados"

  try {
    // Construir la consulta con filtros
    const where: any = {}

    if (categoria) {
      where.categoria = {
        nombre: categoria,
      }
    }

    if (etiquetasEco.length > 0) {
      where.etiquetasEco = {
        some: {
          etiquetaEco: {
            nombre: {
              in: etiquetasEco,
            },
          },
        },
      }
    }

    if (precioMin !== undefined || precioMax !== undefined) {
      where.precio = {}

      if (precioMin !== undefined) {
        where.precio.gte = precioMin
      }

      if (precioMax !== undefined) {
        where.precio.lte = precioMax
      }
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: "insensitive" } },
        { descripcion: { contains: busqueda, mode: "insensitive" } },
      ]
    }

    // Determinar el orden
    let orderBy: any = {}

    switch (ordenar) {
      case "precio-asc":
        orderBy = { precio: "asc" }
        break
      case "precio-desc":
        orderBy = { precio: "desc" }
        break
      case "nombre-asc":
        orderBy = { nombre: "asc" }
        break
      case "nombre-desc":
        orderBy = { nombre: "desc" }
        break
      case "nuevos":
        orderBy = { creado: "desc" }
        break
      case "calificacion":
        orderBy = { calificacion: "desc" }
        break
      default:
        // Por defecto, productos destacados (esNuevo primero, luego calificacion)
        orderBy = [{ esNuevo: "desc" }, { calificacion: "desc" }]
    }

    // Calcular paginación
    const skip = (pagina - 1) * limite

    // Obtener productos con relaciones
    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      skip,
      take: limite,
      include: {
        categoria: true,
        etiquetasEco: {
          include: {
            etiquetaEco: true,
          },
        },
        variantes: true,
      },
    })

    // Obtener el total de productos para la paginación
    const total = await prisma.producto.count({ where })

    // Transformar los datos para la respuesta
    const productosFormateados = productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenes: producto.imagenes,
      categoria: producto.categoria.nombre,
      esNuevo: producto.esNuevo,
      calificacion: producto.calificacion,
      cantidadResenas: producto.cantidadResenas,
      stock: producto.stock,
      etiquetasEco: producto.etiquetasEco.map((el) => el.etiquetaEco.nombre),
      variantes: producto.variantes.map((v) => ({
        id: v.id,
        nombre: v.nombre,
        precio: v.precio,
        stock: v.stock,
      })),
    }))

    return NextResponse.json({
      datos: productosFormateados,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // Verificar autenticación y permisos de administrador
  const sesion = await verificarAutenticacion(request)

  if (!sesion || !sesion.usuario.esAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const datos = await request.json()

    // Validar datos del producto
    if (!datos.nombre || !datos.precio || !datos.categoriaId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Crear el producto
    const producto = await prisma.producto.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio,
        imagenes: datos.imagenes || [],
        categoriaId: datos.categoriaId,
        stock: datos.stock || 0,
        esNuevo: datos.esNuevo || false,
      },
    })

    // Crear variantes si existen
    if (datos.variantes && datos.variantes.length > 0) {
      await prisma.varianteProducto.createMany({
        data: datos.variantes.map((variante: any) => ({
          nombre: variante.nombre,
          precio: variante.precio,
          productoId: producto.id,
          stock: variante.stock || 0,
        })),
      })
    }

    // Asociar etiquetas ecológicas si existen
    if (datos.etiquetasEco && datos.etiquetasEco.length > 0) {
      for (const etiqueta of datos.etiquetasEco) {
        // Buscar o crear la etiqueta
        const etiquetaEco = await prisma.etiquetaEco.upsert({
          where: { nombre: etiqueta },
          update: {},
          create: { nombre: etiqueta },
        })

        // Asociar la etiqueta al producto
        await prisma.productoEtiquetaEco.create({
          data: {
            productoId: producto.id,
            etiquetaEcoId: etiquetaEco.id,
          },
        })
      }
    }

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

