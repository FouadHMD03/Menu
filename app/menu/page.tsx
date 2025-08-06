import { MenuDisplay } from "@/components/menu-display";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { MenuData } from "@/lib/types";

export default async function MenuPage() {
  const supabase = createServerSupabaseClient();
  let menu: MenuData = [];
  let error: string | null = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('menu_categories')
      .select('id, name, order_index, menu_items(id, name, price, description, image_url, order_index)')
      .order('order_index', { ascending: true })
      .order('order_index', { foreignTable: 'menu_items', ascending: true });

    if (fetchError) throw fetchError;

    menu = data.map(category => ({
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
  } catch (err: any) {
    console.error("Error fetching menu on server:", err);
    error = "Failed to load menu. Please try again later.";
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-12 bg-gray-50">
      <MenuDisplay menu={menu} />
    </main>
  );
}
