import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface OrderStatusEmailProps {
  orderNumber: string
  userName: string
  orderStatus: string
  orderDate: string
  shippingAddress: string
  total: string
}

export const OrderStatusEmail = ({
  orderNumber,
  userName,
  orderStatus,
  orderDate,
  shippingAddress,
  total,
}: OrderStatusEmailProps) => {
  // Obtener mensaje según estado
  const getStatusMessage = () => {
    switch (orderStatus) {
      case "PROCESANDO":
        return "Tu pedido está siendo procesado. Estamos preparando tus productos para el envío."
      case "ENVIADO":
        return "Tu pedido ha sido enviado y está en camino. Pronto recibirás tus productos."
      case "ENTREGADO":
        return "¡Tu pedido ha sido entregado! Esperamos que disfrutes tus productos."
      case "CANCELADO":
        return "Tu pedido ha sido cancelado. Si tienes alguna pregunta, contáctanos."
      default:
        return "Hemos actualizado el estado de tu pedido."
    }
  }

  // Obtener color según estado
  const getStatusColor = () => {
    switch (orderStatus) {
      case "PROCESANDO":
        return "bg-yellow-50 text-yellow-700"
      case "ENVIADO":
        return "bg-purple-50 text-purple-700"
      case "ENTREGADO":
        return "bg-green-50 text-green-700"
      case "CANCELADO":
        return "bg-red-50 text-red-700"
      default:
        return "bg-blue-50 text-blue-700"
    }
  }

  return (
    <Html>
      <Head />
      <Preview>Actualización del estado de tu pedido en EcoCosmetics</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto p-4 max-w-[600px]">
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
              alt="EcoCosmetics"
              width="150"
              height="40"
              className="my-6"
            />
            <Heading className="text-2xl font-bold text-gray-800 mb-4">Hola, {userName}</Heading>
            <Text className="text-gray-600 mb-4">{getStatusMessage()}</Text>

            <Section className={`p-6 rounded-lg mb-6 ${getStatusColor()}`}>
              <Heading className="text-lg font-semibold mb-2">Estado del pedido: {orderStatus}</Heading>
              <Text>
                Pedido #{orderNumber.slice(0, 8)} • {orderDate}
              </Text>
            </Section>

            <Section className="bg-gray-50 p-6 rounded-lg mb-6">
              <Heading className="text-lg font-semibold text-gray-800 mb-2">Detalles del pedido</Heading>
              <Text className="text-gray-600 mb-1">
                <strong>Dirección de envío:</strong> {shippingAddress}
              </Text>
              <Text className="text-gray-600 mb-1">
                <strong>Total:</strong> ${total}
              </Text>
            </Section>

            <Section className="text-center mb-6">
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos/${orderNumber}`}
                className="bg-green-700 text-white py-3 px-6 rounded-md font-medium no-underline inline-block"
              >
                Ver detalles del pedido
              </Link>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-sm text-gray-500 mb-1">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos a{" "}
              <Link href="mailto:soporte@ecocosmetics.com" className="text-green-700">
                soporte@ecocosmetics.com
              </Link>
            </Text>

            <Text className="text-sm text-gray-500 mb-6">
              © {new Date().getFullYear()} EcoCosmetics. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

