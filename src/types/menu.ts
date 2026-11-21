export type CategoryId =
  | 'all'
  | 'breakfast'
  | 'salads'
  | 'soups'
  | 'mains'
  | 'pasta'
  | 'desserts'
  | 'drinks'
  | 'combos';

export type DishTag = 'popular' | 'new' | 'vegetarian' | 'spicy';

export interface DishAddon {
  id: string;
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  category: Exclude<CategoryId, 'all'>;
  name: string;
  description: string;
  fullDescription: string;
  ingredients: string[];
  allergens?: string;
  price: number;
  weight: string;
  image: string;
  tags: DishTag[];
  addons: DishAddon[];
}

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  subtitle: string;
}

export interface CartItem {
  cartKey: string;
  dish: Dish;
  selectedAddons: DishAddon[];
  quantity: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  dishOrdered: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OrderSubmission {
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  preferredTime: string;
  paymentMethod: 'card_on_delivery' | 'cash' | 'online_sbp';
  comment?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}
