import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface AccountStatusEmailProps {
  userName: string
  status: "ACTIVO" | "PAUSADO"
  message: string
}

export const AccountStatusEmail = ({ userName, status, message }: AccountStatusEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Actualización sobre el estado de tu cuenta en EcoCosmetics</Preview>
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
            <Text className="text-gray-600 mb-4">{message}</Text>

            <Section className={`p-6 rounded-lg mb-6 ${status === "ACTIVO" ? "bg-green-50" : "bg-red-50"}`}>
              <Heading
                className={`text-lg font-semibold mb-2 ${status === "ACTIVO" ? "text-green-700" : "text-red-700"}`}
              >
                Estado de tu cuenta: {status}
              </Heading>
              <Text className={`${status === "ACTIVO" ? "text-green-600" : "text-red-600"}`}>
                {status === "ACTIVO"
                  ? "Tu cuenta está activa y puedes acceder a todos nuestros servicios."
                  : "Tu cuenta está pausada temporalmente."}
              </Text>
            </Section>

            {status === "ACTIVO" && (
              <Section className="text-center mb-6">
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/auth/iniciar-sesion`}
                  className="bg-green-700 text-white py-3 px-6 rounded-md font-medium no-underline inline-block"
                >
                  Iniciar sesión
                </Link>
              </Section>
            )}

            <Text className="text-gray-600 mb-4">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.
            </Text>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-sm text-gray-500 mb-1">
              Si no solicitaste este cambio o crees que es un error, por favor contáctanos a{" "}
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

