import Image from "next/image"
import { initialMenuData } from "@/lib/initial-menu-data"

export function A4MenuDisplay() {
  const menu = initialMenuData // Use initial data for a static print view

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="w-[794px] h-[1123px] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col p-12 font-sans text-gray-800">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-orange-800 mb-2 drop-shadow-sm">
            Our Delicious Menu
          </h1>
          <p className="text-xl text-amber-700 font-medium">
            Freshly Prepared, Just for You
          </p>
        </header>

        {/* Menu Categories */}
        <div className="flex-grow overflow-y-auto pr-4 -mr-4"> {/* Added overflow for long menus */}
          {menu.map((categoryData, catIndex) => (
            <section key={catIndex} className="mb-8 last:mb-0">
              <h2 className="text-3xl font-bold capitalize text-orange-700 border-b-2 border-amber-300 pb-2 mb-6">
                {categoryData.category}
              </h2>
              <div className="grid gap-6">
                {categoryData.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-6 bg-orange-50 p-4 rounded-lg shadow-sm">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover aspect-square border border-orange-200"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-orange-600 ml-auto">
                      {item.price !== null ? `${item.price} DA` : "Price on request"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-10 text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Your Restaurant Name. All Rights Reserved.</p>
          <p>For reservations or inquiries, please contact us.</p>
        </footer>
      </div>
    </div>
  )
}
