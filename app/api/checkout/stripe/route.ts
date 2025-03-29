import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
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

    // Crear los line items para Stripe
    const lineItems = []

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

      lineItems.push({
        price_data: {
          currency: "ars",
          product_data: {
            name: product.name + (variantName ? ` (${variantName})` : ""),
            images: product.images,
          },
          unit_amount: price,
        },
        quantity: item.quantity,
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
      lineItems.push({
        price_data: {
          currency: "ars",
          product_data: {
            name: "Costo de envío",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      })
    }

    // Crear la sesión de Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/carrito`,
      metadata: {
        userId: session.user.id,
        addressId: shippingAddressId,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

