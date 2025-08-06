import Image from "next/image"
import { initialMenuData } from "@/lib/initial-menu-data"

export function A4MenuDisplay() {
  const menu = initialMenuData // Use initial data for a static print view

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      <div className="w-[794px] h-[1123px] bg-white shadow-xl rounded-lg overflow-hidden flex flex-col p-12 font-sans text-gray-800 print:shadow-none print:rounded-none print:w-full print:h-auto print:min-h-[1123px]">
        {/* Header */}
        <header className="text-center mb-10 print:mb-6">
          <h1 className="text-5xl font-extrabold text-orange-800 mb-2 drop-shadow-sm print:text-4xl print:text-gray-900">
            Our Delicious Menu
          </h1>
          <p className="text-xl text-amber-700 font-medium print:text-lg print:text-gray-700">
            Freshly Prepared, Just for You
          </p>
        </header>

        {/* Menu Categories */}
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 print:overflow-visible print:pr-0 print:mr-0">
          {menu.map((categoryData, catIndex) => (
            <section key={catIndex} className="mb-8 last:mb-0 print:mb-4">
              <h2 className="text-3xl font-bold capitalize text-orange-700 border-b-2 border-amber-300 pb-2 mb-6 print:text-2xl print:text-gray-800 print:border-gray-300 print:mb-4">
                {categoryData.category}
              </h2>
              <div className="grid gap-6 print:gap-4">
                {categoryData.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-6 bg-orange-50 p-4 rounded-lg shadow-sm print:bg-white print:p-0 print:rounded-none print:shadow-none print:border-b print:border-gray-200 print:pb-4 last:print:border-b-0 last:print:pb-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover aspect-square border border-orange-200 print:w-16 print:h-16 print:border-gray-200"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 print:text-lg print:font-medium">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-700 leading-relaxed print:text-xs print:text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-orange-600 ml-auto print:text-xl print:text-gray-900">
                      {item.price !== null ? `${item.price} DA` : "Price on request"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-10 text-gray-600 text-sm print:mt-6 print:text-xs print:text-gray-500">
          <p>&copy; {new Date().getFullYear()} Your Restaurant Name. All Rights Reserved.</p>
          <p>For reservations or inquiries, please contact us.</p>
        </footer>
      </div>
    </div>
  )
}
