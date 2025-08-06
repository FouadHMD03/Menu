import { MenuData, MenuItem } from "./types";

// Helper function to sort items by price (lowest to highest)
const sortItemsByPrice = (items: MenuItem[]) => {
  return [...items].sort((a, b) => {
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1; // Null prices go to the end
    if (b.price === null) return -1; // Null prices go to the end
    return a.price - b.price;
  });
};

export const initialMenuData: MenuData = [
  {
    category: "pizza",
    items: sortItemsByPrice([
      { name: "pizza Marguerita", price: 600, description: "Classic tomato sauce, mozzarella, and fresh basil.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Champignon", price: 800, description: "Topped with fresh, sautéed mushrooms and mozzarella.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Poulet", price: 800, description: "Tender grilled chicken, onions, and a special sauce.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Thon", price: 800, description: "Delicious tuna, olives, and a hint of garlic.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Végétarienne", price: 900, description: "A garden of fresh seasonal vegetables.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Viande", price: 900, description: "Hearty ground beef, onions, and spices.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Trois fromage", price: 900, description: "A rich blend of three premium cheeses.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "pizza Fumée", price: 900, description: "Smoked turkey, bell peppers, and a smoky BBQ drizzle.", imageUrl: "/placeholder.svg?height=100&width=100" },
    ]),
  },
  {
    category: "tacos",
    items: sortItemsByPrice([
      { name: "Tacos Poulet", price: 500, description: "Grilled chicken, fresh salsa, and crisp lettuce in a soft tortilla.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Tacos Viande", price: 600, description: "Seasoned ground beef, cheese, and pico de gallo.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Tacos Mixte", price: 700, description: "A delicious combination of chicken and beef.", imageUrl: "/placeholder.svg?height=100&width=100" },
    ]),
  },
  {
    category: "burger",
    items: sortItemsByPrice([
      { name: "Burger Classique", price: 400, description: "Our signature beef patty with lettuce, tomato, and onion.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Burger Double cheese", price: 600, description: "Two juicy beef patties, double cheddar, and pickles.", imageUrl: "/placeholder.svg?height=100&width=100" },
    ]),
  },
  // The "fajitas" family has been removed as requested
  {
    category: "Poutines",
    items: sortItemsByPrice([
      { name: "Poutine Poulet", price: 650, description: "Crispy fries, cheese curds, rich gravy, and shredded chicken.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Poutine Viande", price: 750, description: "Golden fries, squeaky cheese curds, and savory ground meat.", imageUrl: "/placeholder.svg?height=100&width=100" },
    ]),
  },
  {
    category: "Gastro",
    items: sortItemsByPrice([
      { name: "Kefta américaine", price: 1200, description: "Spiced Moroccan meatballs with a unique American twist.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Escalope grillé", price: 1300, description: "Perfectly grilled escalope, served with your choice of side.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Escalope à la crème", price: 1500, description: "Tender escalope smothered in a luxurious creamy mushroom sauce.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Escalope à la milanèse", price: 1500, description: "Crispy breaded escalope, golden-fried to perfection.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Entrecote", price: 2200, description: "A premium cut of ribeye steak, grilled to your liking.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Filet", price: 2800, description: "Melt-in-your-mouth tenderloin filet, a true culinary delight.", imageUrl: "/placeholder.svg?height=100&width=100" },
      { name: "Mixte de viande", price: 4500, description: "A grand platter featuring an assortment of our finest grilled meats.", imageUrl: "/placeholder.svg?height=100&width=100" },
    ]),
  },
];
