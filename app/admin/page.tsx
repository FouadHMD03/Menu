"use client"

import { useState } from "react"
import { MenuEditor } from "@/components/menu-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  // For this client-side demo, we'll hardcode the password for reliability.
  // In a real application, this would be securely stored and checked server-side.
  const ADMIN_PASSWORD = "admin123" // Explicitly set for demo purposes

  const handleLogin = () => {
    console.log("Attempting login with password:", password);
    console.log("Expected password:", ADMIN_PASSWORD);

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      toast({
        title: "Login Successful",
        description: "You can now edit the menu.",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter password to access menu editor.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin()
                  }
                }}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-12 bg-gray-50">
      <MenuEditor />
    </main>
  )
}
