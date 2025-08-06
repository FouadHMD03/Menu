import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Dynamic Menu</h1>
        <p className="text-lg text-gray-600">
          Easily manage and share your restaurant's menu.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">View Your Menu</h2>
          <p className="text-gray-700 mb-6 text-center">
            See how your menu looks to your customers.
          </p>
          <Link href="/menu" passHref>
            <Button size="lg">Go to Menu</Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Edit Your Menu</h2>
          <p className="text-gray-700 mb-6 text-center">
            Access the admin panel to update prices and items.
          </p>
          <Link href="/admin" passHref>
            <Button size="lg" variant="secondary">Go to Admin Panel</Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 w-full max-w-md">
        <QRCodeGenerator />
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          **Note on Persistence:** Menu changes are saved to your browser's local storage only.
          For a shared, persistent menu, consider integrating a database.
        </p>
        <p className="mt-2">
          Admin Password (for demo): `admin123` (You can change this by setting `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable)
        </p>
      </div>
    </main>
  )
}
