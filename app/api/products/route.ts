import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get("category")
  const ecoLabel = searchParams.get("ecoLabel")
  const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : undefined
  const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : undefined
  const sort = searchParams.get("sort") || "featured"
  const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 12

  try {
    // Construir la consulta con filtros
    const where: any = {}

    if (category) {
      where.category = {
        name: category,
      }
    }

    if (ecoLabel) {
      where.ecoLabels = {
        some: {
          ecoLabel: {
            name: ecoLabel,
          },
        },
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}

      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // Determinar el orden
    let orderBy: any = {}

    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "name-asc":
        orderBy = { name: "asc" }
        break
      case "name-desc":
        orderBy = { name: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      default:
        // Por defecto, productos destacados (isNew primero, luego rating)
        orderBy = [{ isNew: "desc" }, { rating: "desc" }]
    }

    // Calcular paginación
    const skip = (page - 1) * limit

    // Obtener productos con relaciones
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
        ecoLabels: {
          include: {
            ecoLabel: true,
          },
        },
        variants: true,
      },
    })

    // Obtener el total de productos para la paginación
    const total = await prisma.product.count({ where })

    // Transformar los datos para la respuesta
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      category: product.category.name,
      isNew: product.isNew,
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: product.stock,
      ecoLabels: product.ecoLabels.map((el) => el.ecoLabel.name),
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        stock: v.stock,
      })),
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
  }
}

