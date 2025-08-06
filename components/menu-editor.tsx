"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MenuData, MenuCategory, MenuItem } from "@/lib/types"
import { initialMenuData } from "@/lib/initial-menu-data"
import { PlusIcon, MinusIcon, SaveIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react' // Import Arrow icons
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export function MenuEditor() {
  const [menu, setMenu] = useState<MenuData>(initialMenuData)
  const { toast } = useToast()

  useEffect(() => {
    const storedMenu = localStorage.getItem("restaurant_menu")
    if (storedMenu) {
      try {
        setMenu(JSON.parse(storedMenu))
      } catch (e) {
        console.error("Failed to parse menu from local storage", e)
        setMenu(initialMenuData)
      }
    }
  }, [])

  const handleCategoryChange = (index: number, newCategory: string) => {
    const newMenu = [...menu]
    newMenu[index].category = newCategory
    setMenu(newMenu)
  }

  const handleItemChange = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) => {
    const newMenu = [...menu]
    if (field === "price") {
      newMenu[catIndex].items[itemIndex][field] = value === "" ? null : Number(value)
    } else {
      newMenu[catIndex].items[itemIndex][field] = value as any
    }
    setMenu(newMenu)
  }

  const handleAddItem = (catIndex: number) => {
    const newMenu = [...menu]
    newMenu[catIndex].items.push({ name: "", price: null, description: "", imageUrl: "" })
    setMenu(newMenu)
  }

  const handleRemoveItem = (catIndex: number, itemIndex: number) => {
    const newMenu = [...menu]
    newMenu[catIndex].items.splice(itemIndex, 1)
    setMenu(newMenu)
  }

  const handleAddCategory = () => {
    setMenu([...menu, { category: "", items: [{ name: "", price: null, description: "", imageUrl: "" }] }])
  }

  const handleRemoveCategory = (catIndex: number) => {
    const newMenu = [...menu]
    newMenu.splice(catIndex, 1)
    setMenu(newMenu)
  }

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    if (direction === 'up' && index > 0) {
      [newMenu[index - 1], newMenu[index]] = [newMenu[index], newMenu[index - 1]];
    } else if (direction === 'down' && index < newMenu.length - 1) {
      [newMenu[index + 1], newMenu[index]] = [newMenu[index], newMenu[index + 1]];
    }
    setMenu(newMenu);
  };

  const handleSave = () => {
    localStorage.setItem("restaurant_menu", JSON.stringify(menu))
    toast({
      title: "Menu Saved!",
      description: "Your menu changes have been saved to local storage.",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Your Menu</h1>
      <Button onClick={handleAddCategory} className="mb-6 w-full">
        <PlusIcon className="mr-2 h-4 w-4" /> Add New Category
      </Button>

      {menu.map((categoryData, catIndex) => (
        <Card key={catIndex} className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-1 flex-grow"> {/* Added flex-grow */}
              <CardTitle>
                <Input
                  value={categoryData.category}
                  onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                  placeholder="Category Name"
                  className="text-xl font-semibold"
                />
              </CardTitle>
              <CardDescription>Edit items in this category.</CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-4"> {/* Added ml-4 for spacing */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMoveCategory(catIndex, 'up')}
                disabled={catIndex === 0}
                aria-label="Move category up"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMoveCategory(catIndex, 'down')}
                disabled={catIndex === menu.length - 1}
                aria-label="Move category down"
              >
                <ArrowDownIcon className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleRemoveCategory(catIndex)} aria-label="Remove category">
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            {categoryData.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex flex-col gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-end gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor={`item-name-${catIndex}-${itemIndex}`}>Item Name</Label>
                    <Input
                      id={`item-name-${catIndex}-${itemIndex}`}
                      value={item.name}
                      onChange={(e) => handleItemChange(catIndex, itemIndex, "name", e.target.value)}
                      placeholder="e.g., Pizza Marguerita"
                    />
                  </div>
                  <div className="grid gap-2 w-32">
                    <Label htmlFor={`item-price-${catIndex}-${itemIndex}`}>Price (DA)</Label>
                    <Input
                      id={`item-price-${catIndex}-${itemIndex}`}
                      type="number"
                      value={item.price !== null ? item.price : ""}
                      onChange={(e) => handleItemChange(catIndex, itemIndex, "price", e.target.value)}
                      placeholder="e.g., 600"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleRemoveItem(catIndex, itemIndex)} aria-label="Remove item">
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`item-description-${catIndex}-${itemIndex}`}>Description</Label>
                  <Textarea
                    id={`item-description-${catIndex}-${itemIndex}`}
                    value={item.description || ""}
                    onChange={(e) => handleItemChange(catIndex, itemIndex, "description", e.target.value)}
                    placeholder="A short description of the item..."
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`item-image-${catIndex}-${itemIndex}`}>Image URL</Label>
                  <Input
                    id={`item-image-${catIndex}-${itemIndex}`}
                    value={item.imageUrl || ""}
                    onChange={(e) => handleItemChange(catIndex, itemIndex, "imageUrl", e.target.value)}
                    placeholder="/placeholder.svg?height=100&width=100"
                  />
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={() => handleAddItem(catIndex)} className="mt-4">
              <PlusIcon className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSave} className="w-full mt-8">
        <SaveIcon className="mr-2 h-4 w-4" /> Save All Changes
      </Button>
    </div>
  )
}
