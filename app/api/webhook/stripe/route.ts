import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { OrderConfirmationEmail } from "@/emails/order-confirmation"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    try {
      // Obtener los metadatos de la sesión
      const { userId, addressId } = session.metadata

      // Obtener los items del carrito desde la sesión
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Crear la orden en la base de datos
      const order = await prisma.order.create({
        data: {
          userId,
          addressId,
          total: session.amount_total,
          paymentMethod: "stripe",
          paymentId: session.payment_intent,
          status: "PROCESSING",
          // Los items se agregarán después
        },
      })

      // Obtener los detalles de los productos para cada line item
      for (const item of lineItems.data) {
        // Extraer el ID del producto y la variante del nombre del producto
        // Esto es una simplificación, en producción necesitarías una forma más robusta
        // de identificar los productos y variantes
        const productName = item.description
        const product = await prisma.product.findFirst({
          where: {
            name: {
              contains: productName.split(" (")[0],
            },
          },
          include: {
            variants: true,
          },
        })

        if (product) {
          let variantId = null

          // Verificar si hay una variante en el nombre del producto
          const variantMatch = productName.match(/$$([^)]+)$$/)
          if (variantMatch && variantMatch[1]) {
            const variantName = variantMatch[1]
            const variant = product.variants.find((v) => v.name === variantName)
            if (variant) {
              variantId = variant.id
            }
          }

          // Crear el item de la orden
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              productVariantId: variantId,
              quantity: item.quantity,
              price: item.amount_total,
            },
          })

          // Actualizar el stock del producto
          if (variantId) {
            await prisma.productVariant.update({
              where: { id: variantId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          } else {
            await prisma.product.update({
              where: { id: product.id },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          }
        }
      }

      // Obtener los datos del usuario y la dirección para el email
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      const address = await prisma.address.findUnique({
        where: { id: addressId },
      })

      // Enviar email de confirmación
      if (user?.email) {
        await resend.emails.send({
          from: "EcoCosmetics <no-reply@ecocosmetics.com>",
          to: user.email,
          subject: "Confirmación de tu pedido",
          react: OrderConfirmationEmail({
            orderNumber: order.id,
            userName: user.name || "Cliente",
            orderDate: new Date().toLocaleDateString(),
            shippingAddress: address
              ? `${address.street} ${address.number}, ${address.city}, ${address.state}`
              : "No disponible",
            total: (session.amount_total / 100).toFixed(2),
          }),
        })
      }

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("Error processing Stripe webhook:", error)
      return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

