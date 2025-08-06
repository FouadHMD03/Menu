"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MenuData } from "@/lib/types"
import { initialMenuData } from "@/lib/initial-menu-data"
import Image from "next/image" // Import Next.js Image component

export function MenuDisplay() {
  const [menu, setMenu] = useState<MenuData>(initialMenuData)

  useEffect(() => {
    // Attempt to load menu from local storage
    const storedMenu = localStorage.getItem("restaurant_menu")
    if (storedMenu) {
      try {
        setMenu(JSON.parse(storedMenu))
      } catch (e) {
        console.error("Failed to parse menu from local storage", e)
        // Fallback to initial data if parsing fails
        setMenu(initialMenuData)
      }
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-orange-800 drop-shadow-sm">
        Our Delicious Menu
      </h1>
      <Accordion type="multiple" className="w-full">
        {menu.map((categoryData, index) => (
          <Card key={categoryData.category} className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg border-orange-200">
            <CardHeader className="p-0">
              <AccordionItem value={`item-${index}`} className="border-b-0">
                <AccordionTrigger className="px-6 py-4 text-xl font-bold capitalize text-orange-700 hover:no-underline transition-colors duration-200">
                  {categoryData.category}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid gap-3">
                    {categoryData.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-orange-100 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-4 mb-2 sm:mb-0">
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover aspect-square"
                            />
                          )}
                          <div>
                            <span className="text-lg font-medium text-gray-800 block">{item.name}</span>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-orange-600 sm:ml-auto">
                          {item.price !== null ? `${item.price} DA` : "Price on request"}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </CardHeader>
          </Card>
        ))}
      </Accordion>
    </div>
  )
}
