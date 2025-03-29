import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { preference } from "mercadopago"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddressId } = body

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Obtener la dirección de envío
    const shippingAddress = await prisma.address.findUnique({
      where: {
        id: shippingAddressId,
        userId: session.user.id,
      },
    })

    if (!shippingAddress) {
      return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 })
    }

    // Obtener los productos del carrito
    const productIds = items.map((item) => item.id)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        variants: true,
      },
    })

    // Crear los items para MercadoPago
    const preferenceItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.id)

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 })
      }

      // Si hay variante, buscar el precio de la variante
      let price = product.price
      let variantName = ""

      if (item.variant) {
        const variant = product.variants.find((v) => v.id === item.variant)
        if (variant) {
          price = variant.price
          variantName = variant.name
        }
      }

      preferenceItems.push({
        title: product.name + (variantName ? ` (${variantName})` : ""),
        quantity: item.quantity,
        unit_price: price / 100, // MercadoPago usa el precio en la moneda base, no en centavos
        picture_url: product.images[0],
      })
    }

    // Calcular costos de envío
    const subtotal = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) return total

      let price = product.price

      if (item.variant) {
        const variant = product.variants.find((v) => v.id === item.variant)
        if (variant) {
          price = variant.price
        }
      }

      return total + price * item.quantity
    }, 0)

    const shippingCost = subtotal > 5000 ? 0 : 499

    if (shippingCost > 0) {
      preferenceItems.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: shippingCost / 100,
      })
    }

    // Crear la preferencia de MercadoPago
    const preferenceResponse = await preference.create({
      body: {
        items: preferenceItems,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/carrito`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        external_reference: session.user.id,
        metadata: {
          userId: session.user.id,
          addressId: shippingAddressId,
        },
      },
    })

    return NextResponse.json({
      id: preferenceResponse.id,
      init_point: preferenceResponse.init_point,
    })
  } catch (error) {
    console.error("Error creating MercadoPago preference:", error)
    return NextResponse.json({ error: "Error creating MercadoPago preference" }, { status: 500 })
  }
}

