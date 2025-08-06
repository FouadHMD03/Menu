"use client"

import { useEffect, useState } from "react"
import qrcode from "qrcode" // Import the base qrcode library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QRCodeGenerator() {
  const [url, setUrl] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get the current host and construct the menu URL
    if (typeof window !== "undefined") {
      const currentHost = window.location.origin
      const menuUrl = `${currentHost}/menu`
      setUrl(menuUrl)

      // Generate QR code as a data URL
      qrcode.toDataURL(menuUrl, { errorCorrectionLevel: 'H', width: 256 })
        .then(dataUrl => {
          setQrDataUrl(dataUrl)
        })
        .catch(err => {
          console.error("Failed to generate QR code:", err)
          setQrDataUrl(null) // Ensure it's null on error
        })
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Menu QR Code</CardTitle>
        <CardDescription>Scan this QR code to view the menu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {qrDataUrl ? (
          <div className="p-4 border rounded-lg bg-white">
            <img src={qrDataUrl || "/placeholder.svg"} alt="Menu QR Code" width={256} height={256} />
          </div>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Generating QR Code...</p>
          </div>
        )}
        <div className="w-full grid gap-2">
          <Label htmlFor="menu-url">Menu URL</Label>
          <Input id="menu-url" type="text" value={url} readOnly className="text-center" />
        </div>
      </CardContent>
    </Card>
  )
}
