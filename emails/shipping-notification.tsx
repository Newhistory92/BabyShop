import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { formatearPrecio } from "@/lib/utils"

interface ShippingNotificationEmailProps {
  nombreCliente: string
  numeroPedido: string
  numeroSeguimiento?: string
  empresaEnvio: string
  fechaEstimadaEntrega?: string
  direccionEnvio: {
    calle: string
    numero: string
    piso?: string
    departamento?: string
    codigoPostal: string
    localidad: string
    provincia: string
  }
  esRetiroTienda: boolean
  sucursalRetiro?: {
    nombre: string
    direccion: string
    horario: string
  }
  productos: Array<{
    nombre: string
    cantidad: number
    precio: number
    imagen?: string
  }>
}

export const ShippingNotificationEmail = ({
  nombreCliente,
  numeroPedido,
  numeroSeguimiento,
  empresaEnvio,
  fechaEstimadaEntrega,
  direccionEnvio,
  esRetiroTienda,
  sucursalRetiro,
  productos,
}: ShippingNotificationEmailProps) => {
  const previewText = esRetiroTienda
    ? `Tu pedido #${numeroPedido} está listo para retirar`
    : `Tu pedido #${numeroPedido} ha sido enviado`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
              width="120"
              height="36"
              alt="EcoCosmetics"
              style={logo}
            />
          </Section>
          <Hr style={hr} />
          <Section style={content}>
            <Heading style={heading}>
              {esRetiroTienda ? "¡Tu pedido está listo para retirar!" : "¡Tu pedido ha sido enviado!"}
            </Heading>

            <Text style={paragraph}>Hola {nombreCliente},</Text>

            <Text style={paragraph}>
              {esRetiroTienda
                ? `Tu pedido #${numeroPedido} ya está listo para ser retirado en nuestra tienda.`
                : `Tu pedido #${numeroPedido} ha sido enviado y está en camino a tu dirección.`}
            </Text>

            {!esRetiroTienda && numeroSeguimiento && (
              <Section style={trackingContainer}>
                <Text style={trackingTitle}>Información de seguimiento:</Text>
                <Text style={trackingNumber}>
                  Número de seguimiento: <strong>{numeroSeguimiento}</strong>
                </Text>
                <Text style={trackingInfo}>Empresa de envío: {empresaEnvio}</Text>
                {fechaEstimadaEntrega && (
                  <Text style={trackingInfo}>Fecha estimada de entrega: {fechaEstimadaEntrega}</Text>
                )}
                <Button style={button} href={`https://example.com/tracking/${numeroSeguimiento}`}>
                  Seguir mi pedido
                </Button>
              </Section>
            )}

            {esRetiroTienda && sucursalRetiro && (
              <Section style={trackingContainer}>
                <Text style={trackingTitle}>Información de retiro:</Text>
                <Text style={trackingInfo}>
                  <strong>Sucursal:</strong> {sucursalRetiro.nombre}
                </Text>
                <Text style={trackingInfo}>
                  <strong>Dirección:</strong> {sucursalRetiro.direccion}
                </Text>
                <Text style={trackingInfo}>
                  <strong>Horario de atención:</strong> {sucursalRetiro.horario}
                </Text>
                <Text style={trackingInfo}>
                  <strong>Importante:</strong> Recuerda traer tu DNI y el número de pedido para retirar tu compra.
                </Text>
              </Section>
            )}

            {!esRetiroTienda && (
              <Section style={addressContainer}>
                <Text style={addressTitle}>Dirección de envío:</Text>
                <Text style={addressText}>
                  {direccionEnvio.calle} {direccionEnvio.numero}
                  {direccionEnvio.piso && `, Piso ${direccionEnvio.piso}`}
                  {direccionEnvio.departamento && `, Depto ${direccionEnvio.departamento}`}
                  <br />
                  {direccionEnvio.codigoPostal}, {direccionEnvio.localidad}
                  <br />
                  {direccionEnvio.provincia}
                </Text>
              </Section>
            )}

            <Section style={orderContainer}>
              <Text style={orderTitle}>Resumen del pedido:</Text>
              {productos.map((producto, index) => (
                <Row key={index} style={productRow}>
                  {producto.imagen && (
                    <Column style={productImageContainer}>
                      <Img src={producto.imagen} width="64" height="64" alt={producto.nombre} style={productImage} />
                    </Column>
                  )}
                  <Column style={productDetails}>
                    <Text style={productName}>{producto.nombre}</Text>
                    <Text style={productQuantity}>Cantidad: {producto.cantidad}</Text>
                    <Text style={productPrice}>{formatearPrecio(producto.precio)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos respondiendo a este email o a través
              de nuestro centro de ayuda.
            </Text>

            <Text style={paragraph}>¡Gracias por comprar en EcoCosmetics!</Text>

            <Text style={signature}>El equipo de EcoCosmetics</Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} EcoCosmetics. Todos los derechos reservados.</Text>
            <Text style={footerLinks}>
              <Link style={link} href="#">
                Política de Privacidad
              </Link>{" "}
              •{" "}
              <Link style={link} href="#">
                Términos y Condiciones
              </Link>{" "}
              •{" "}
              <Link style={link} href="#">
                Cancelar Suscripción
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const logoContainer = {
  padding: "20px",
}

const logo = {
  margin: "0 auto",
}

const content = {
  padding: "0 20px",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#484848",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
}

const trackingContainer = {
  backgroundColor: "#f9f9f9",
  borderRadius: "5px",
  padding: "15px",
  marginBottom: "20px",
}

const trackingTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  color: "#484848",
}

const trackingNumber = {
  fontSize: "16px",
  margin: "5px 0",
  color: "#484848",
}

const trackingInfo = {
  fontSize: "14px",
  margin: "5px 0",
  color: "#484848",
}

const button = {
  backgroundColor: "#4CAF50",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "20px 0 0",
}

const addressContainer = {
  marginBottom: "20px",
}

const addressTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  color: "#484848",
}

const addressText = {
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  color: "#484848",
}

const orderContainer = {
  marginBottom: "20px",
}

const orderTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  color: "#484848",
}

const productRow = {
  marginBottom: "10px",
}

const productImageContainer = {
  width: "80px",
  verticalAlign: "top",
}

const productImage = {
  borderRadius: "5px",
  border: "1px solid #eaeaea",
}

const productDetails = {
  verticalAlign: "top",
  paddingLeft: "10px",
}

const productName = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 5px 0",
  color: "#484848",
}

const productQuantity = {
  fontSize: "14px",
  margin: "0 0 5px 0",
  color: "#484848",
}

const productPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
  color: "#484848",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const signature = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "20px 0",
  color: "#484848",
}

const footer = {
  padding: "0 20px",
}

const footerText = {
  fontSize: "12px",
  color: "#9ca299",
  margin: "10px 0",
  textAlign: "center" as const,
}

const footerLinks = {
  fontSize: "12px",
  color: "#9ca299",
  margin: "10px 0",
  textAlign: "center" as const,
}

const link = {
  color: "#9ca299",
  textDecoration: "underline",
}

export default ShippingNotificationEmail

