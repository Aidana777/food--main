import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { DishModal } from './components/DishModal';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ReviewsFaqDelivery } from './components/ReviewsFaqDelivery';
import { StoryAndProcess } from './components/StoryAndProcess';
import { CartItem, CategoryId, Dish, DishAddon } from './types/menu';

const CART_STORAGE_KEY = 'verbena_bistro_cart_v1';

function buildCartKey(dishId: string, addons: DishAddon[]): string {
  const addonIds = addons
    .map((a) => a.id)
    .sort()
    .join(',');
  return `${dishId}::${addonIds}`;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const addonsSum = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
        return sum + (item.dish.price + addonsSum) * item.quantity;
      }, 0),
    [cartItems]
  );

  const handleAddToCart = (dish: Dish, selectedAddons: DishAddon[], quantity: number) => {
    const key = buildCartKey(dish.id, selectedAddons);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartKey === key);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartKey: key, dish, selectedAddons, quantity }];
    });
  };

  const handleQuickAdd = (dish: Dish) => {
    handleAddToCart(dish, [], 1);
  };

  const handleUpdateSimpleQuantity = (dishId: string, delta: number) => {
    const simpleKey = buildCartKey(dishId, []);
    handleUpdateQuantity(simpleKey, delta);
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderNow = () => {
    if (cartItems.length > 0) {
      setIsCartOpen(true);
    } else {
      const menuEl = document.getElementById('menu');
      menuEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCombos = () => {
    setActiveCategory('combos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#141413]">
      <Header
        totalItems={totalItems}
        subtotal={subtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCombos={handleSelectCombos}
      />

      <main className="flex-1">
        <Hero onOrderNow={handleOrderNow} />

        <MenuSection
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          cartItems={cartItems}
          onSelectDish={setSelectedDish}
          onQuickAdd={handleQuickAdd}
          onUpdateSimpleQuantity={handleUpdateSimpleQuantity}
        />

        <StoryAndProcess />

        <ReviewsFaqDelivery onOpenCart={() => setIsCartOpen(true)} />
      </main>

      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
