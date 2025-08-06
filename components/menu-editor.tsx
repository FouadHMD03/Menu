"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MenuData, MenuCategory, MenuItem } from "@/lib/types"
import { PlusIcon, MinusIcon, SaveIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client"

export function MenuEditor() {
  const [menu, setMenu] = useState<MenuData>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('id, name, order_index, menu_items(id, name, price, description, image_url, order_index)')
          .order('order_index', { ascending: true })
          .order('order_index', { foreignTable: 'menu_items', ascending: true });

        if (error) throw error;

        const formattedMenu: MenuData = data.map(category => ({
          id: category.id,
          category: category.name,
          order_index: category.order_index,
          items: category.menu_items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description || undefined,
            imageUrl: item.image_url || undefined,
            order_index: item.order_index,
          })),
        }));

        setMenu(formattedMenu);
      } catch (err) {
        console.error("Error fetching menu for editor:", err)
        toast({
          title: "Error",
          description: "Failed to load menu for editing.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
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

  const handleAddItem = async (catIndex: number) => {
    const newMenu = [...menu]
    const categoryId = newMenu[catIndex].id
    if (!categoryId) {
      toast({ title: "Error", description: "Category not saved yet. Please save categories first.", variant: "destructive" });
      return;
    }
    const newItem = { name: "", price: null, description: "", imageUrl: "", order_index: newMenu[catIndex].items.length }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          category_id: categoryId,
          name: newItem.name,
          price: newItem.price,
          description: newItem.description,
          image_url: newItem.imageUrl,
          order_index: newItem.order_index,
        })
        .select('id')
        .single()

      if (error) throw error

      newMenu[catIndex].items.push({ ...newItem, id: data.id })
      setMenu(newMenu)
      toast({ title: "Item Added", description: "New item added to database." })
    } catch (err: any) { // Catch error to log details
      console.error("Error adding item:", err)
      toast({ title: "Error adding item", description: err.message || "An unknown error occurred.", variant: "destructive" })
    }
  }

  const handleRemoveItem = async (catIndex: number, itemIndex: number) => {
    const newMenu = [...menu]
    const itemId = newMenu[catIndex].items[itemIndex].id
    if (!itemId) {
      toast({ title: "Error", description: "Item not found in database.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      newMenu[catIndex].items.splice(itemIndex, 1)
      // Re-index remaining items in this category
      newMenu[catIndex].items.forEach((item, idx) => item.order_index = idx);
      setMenu(newMenu)
      toast({ title: "Item Removed", description: "Item removed from database." })
    } catch (err: any) { // Catch error to log details
      console.error("Error removing item:", err)
      toast({ title: "Error removing item", description: err.message || "An unknown error occurred.", variant: "destructive" })
    }
  }

  const handleAddCategory = async () => {
    const newCategory = { category: "", items: [], order_index: menu.length }
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({ name: newCategory.category, order_index: newCategory.order_index })
        .select('id')
        .single()

      if (error) throw error

      setMenu([...menu, { ...newCategory, id: data.id }])
      toast({ title: "Category Added", description: "New category added to database." })
    } catch (err: any) { // Catch error to log details
      console.error("Error adding category:", err)
      toast({ title: "Error adding category", description: err.message || "An unknown error occurred.", variant: "destructive" })
    }
  }

  const handleRemoveCategory = async (catIndex: number) => {
    const newMenu = [...menu]
    const categoryId = newMenu[catIndex].id
    if (!categoryId) {
      toast({ title: "Error", description: "Category not found in database.", variant: "destructive" });
      return;
    }

    try {
      // Delete associated items first (if not cascaded in DB)
      await supabase.from('menu_items').delete().eq('category_id', categoryId);

      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      newMenu.splice(catIndex, 1)
      // Re-index remaining categories
      newMenu.forEach((cat, idx) => cat.order_index = idx);
      setMenu(newMenu)
      toast({ title: "Category Removed", description: "Category removed from database." })
    } catch (err: any) { // Catch error to log details
      console.error("Error removing category:", err)
      toast({ title: "Error removing category", description: err.message || "An unknown error occurred.", variant: "destructive" })
    }
  }

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const newMenu = [...menu];
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < newMenu.length - 1)) {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newMenu[index], newMenu[targetIndex]] = [newMenu[targetIndex], newMenu[index]];

      // Update order_index for the two moved categories
      newMenu[index].order_index = index;
      newMenu[targetIndex].order_index = targetIndex;

      setMenu(newMenu);
      // Save changes to database immediately after moving
      await handleSave();
    }
  };

  const handleSave = async () => {
    try {
      // Save categories
      for (const [index, category] of menu.entries()) {
        if (!category.id) {
          console.warn("Category missing ID, skipping save:", category);
          continue;
        }
        const { error: catError } = await supabase
          .from('menu_categories')
          .upsert({
            id: category.id,
            name: category.category,
            order_index: index,
          }, { onConflict: 'id' })

        if (catError) throw catError

        // Save items for each category
        for (const [itemIndex, item] of category.items.entries()) {
          if (!item.id) {
            console.warn("Item missing ID, skipping save:", item);
            continue;
          }
          const { error: itemError } = await supabase
            .from('menu_items')
            .upsert({
              id: item.id,
              category_id: category.id,
              name: item.name,
              price: item.price,
              description: item.description,
              image_url: item.imageUrl,
              order_index: itemIndex,
            }, { onConflict: 'id' })

          if (itemError) throw itemError
        }
      }
      toast({
        title: "Menu Saved!",
        description: "Your menu changes have been saved to the database.",
      })
    } catch (err: any) { // Catch error to log details
      console.error("Error saving menu:", err)
      toast({
        title: "Error saving menu",
        description: err.message || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-center text-gray-600">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Your Menu</h1>
      <Button onClick={handleAddCategory} className="mb-6 w-full">
        <PlusIcon className="mr-2 h-4 w-4" /> Add New Category
      </Button>

      {menu.map((categoryData, catIndex) => (
        <Card key={categoryData.id || catIndex} className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-1 flex-grow">
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
            <div className="flex items-center gap-2 ml-4">
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
              <div key={item.id || itemIndex} className="flex flex-col gap-4 border-b pb-4 last:border-b-0 last:pb-0">
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
