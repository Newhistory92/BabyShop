"use client"

import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

interface PropiedadesBarcode {
  value: string
  width?: number
  height?: number
  format?: string
  displayValue?: boolean
  fontOptions?: string
  font?: string
  textAlign?: string
  textPosition?: string
  textMargin?: number
  fontSize?: number
  background?: string
  lineColor?: string
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
}

export function Barcode({
  value,
  width = 2,
  height = 100,
  format = "CODE128",
  displayValue = true,
  fontOptions = "",
  font = "monospace",
  textAlign = "center",
  textPosition = "bottom",
  textMargin = 2,
  fontSize = 20,
  background = "#ffffff",
  lineColor = "#000000",
  margin = 10,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
}: PropiedadesBarcode) {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        width,
        height,
        format,
        displayValue,
        fontOptions,
        font,
        textAlign,
        textPosition,
        textMargin,
        fontSize,
        background,
        lineColor,
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      })
    }
  }, [
    value,
    width,
    height,
    format,
    displayValue,
    fontOptions,
    font,
    textAlign,
    textPosition,
    textMargin,
    fontSize,
    background,
    lineColor,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  ])

  return <svg ref={barcodeRef} className="w-full" />
}

