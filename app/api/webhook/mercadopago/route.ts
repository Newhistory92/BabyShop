import { NextResponse } from "next/server"
import { mercadopago } from "@/lib/mercadopago"
import { payment } from "mercadopago"
import prisma from "@/lib/prisma"
import { resend } from "@/lib/resend"
import { OrderConfirmationEmail } from "@/emails/order-confirmation"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // MercadoPago envía diferentes tipos de notificaciones
    // Nos interesa principalmente cuando un pago es aprobado
    if (body.action === "payment.created" || body.action === "payment.updated") {
      const paymentId = body.data.id

      // Obtener los detalles del pago
      const paymentData = await payment.get({ id: paymentId })

      // Solo procesar pagos aprobados
      if (paymentData.status === "approved") {
        // Obtener el ID de usuario desde external_reference
        const userId = paymentData.external_reference

        // Obtener los detalles de la preferencia para obtener los items
        const preferenceId = paymentData.preference_id
        const preferenceData = await mercadopago.preferences.get(preferenceId)

        // Obtener la dirección de envío (esto depende de cómo lo hayas implementado)
        // En este ejemplo, asumimos que guardaste el ID de la dirección en los metadatos
        const addressId = preferenceData.metadata?.addressId

        // Crear la orden en la base de datos
        const order = await prisma.order.create({
          data: {
            userId,
            addressId,
            total: paymentData.transaction_amount * 100, // Convertir a centavos
            paymentMethod: "mercadopago",
            paymentId: paymentId.toString(),
            status: "PROCESSING",
            // Los items se agregarán después
          },
        })

        // Procesar los items de la preferencia
        for (const item of preferenceData.items) {
          // Extraer el ID del producto y la variante del nombre del producto
          const productName = item.title
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
                price: item.unit_price * 100, // Convertir a centavos
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
              total: paymentData.transaction_amount.toFixed(2),
            }),
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing MercadoPago webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}

