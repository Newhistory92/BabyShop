import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        ecoLabels: {
          include: {
            ecoLabel: true,
          },
        },
        variants: true,
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Transformar los datos para la respuesta
    const formattedProduct = {
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
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.userName,
        userImage: review.userImage,
        createdAt: review.createdAt,
      })),
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Error fetching product" }, { status: 500 })
  }
}

