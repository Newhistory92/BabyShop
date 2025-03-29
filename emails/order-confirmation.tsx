import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface OrderConfirmationEmailProps {
  orderNumber: string
  userName: string
  orderDate: string
  shippingAddress: string
  total: string
}

export const OrderConfirmationEmail = ({
  orderNumber,
  userName,
  orderDate,
  shippingAddress,
  total,
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmación de tu pedido en EcoCosmetics</Preview>
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
            <Heading className="text-2xl font-bold text-gray-800 mb-4">¡Gracias por tu compra, {userName}!</Heading>
            <Text className="text-gray-600 mb-4">
              Hemos recibido tu pedido y lo estamos procesando. Te enviaremos una notificación cuando tu pedido sea
              enviado.
            </Text>

            <Section className="bg-gray-50 p-6 rounded-lg mb-6">
              <Heading className="text-lg font-semibold text-gray-800 mb-2">Detalles del pedido</Heading>
              <Text className="text-gray-600 mb-1">
                <strong>Número de pedido:</strong> {orderNumber}
              </Text>
              <Text className="text-gray-600 mb-1">
                <strong>Fecha:</strong> {orderDate}
              </Text>
              <Text className="text-gray-600 mb-1">
                <strong>Dirección de envío:</strong> {shippingAddress}
              </Text>
              <Text className="text-gray-600 mb-1">
                <strong>Total:</strong> ${total}
              </Text>
            </Section>

            <Text className="text-gray-600 mb-4">
              Puedes ver los detalles completos de tu pedido y su estado en tu cuenta:
            </Text>

            <Section className="text-center mb-6">
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/cuenta/pedidos/${orderNumber}`}
                className="bg-green-700 text-white py-3 px-6 rounded-md font-medium no-underline inline-block"
              >
                Ver mi pedido
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

