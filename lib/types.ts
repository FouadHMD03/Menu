export type MenuItem = {
  id?: string; // Added for database operations
  name: string;
  price: number | null;
  description?: string;
  imageUrl?: string;
  order_index?: number; // Added for database operations
};

export type MenuCategory = {
  id?: string; // Added for database operations
  category: string;
  items: MenuItem[];
  order_index?: number; // Added for database operations
};

export type MenuData = MenuCategory[];
