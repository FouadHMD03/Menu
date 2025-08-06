export type MenuItem = {
  name: string;
  price: number | null;
  description?: string; // Added description field
  imageUrl?: string;    // Added imageUrl field
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type MenuData = MenuCategory[];
