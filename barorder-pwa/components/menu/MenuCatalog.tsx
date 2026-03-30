"use client";

import { useMemo, useState } from "react";

import { CartStickyBar } from "@/components/cart/CartStickyBar";
import { CheckoutDrawer } from "@/components/cart/CheckoutDrawer";
import { createCheckoutSession } from "@/lib/checkout-client";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuCategory } from "@/components/menu/MenuCategory";
import { useCart } from "@/hooks/useCart";
import type { CheckoutLineItemInput, MenuCategory as MenuCategoryType, MenuItem } from "@/types";

type MenuCatalogProps = {
  barId: string;
  items: MenuItem[];
};

export function MenuCatalog({ barId, items }: MenuCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryType | "all">("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const {
    items: cartItems,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
    getItemQuantity,
  } = useCart();

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckingOut) {
      return;
    }

    try {
      setCheckoutError(null);
      setIsCheckingOut(true);

      const checkoutItems: CheckoutLineItemInput[] = cartItems.map((entry) => ({
        menuItemId: entry.item.id,
        quantity: entry.quantity,
      }));

      const { checkoutUrl } = await createCheckoutSession({
        barId,
        items: checkoutItems,
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      setIsCheckingOut(false);
      setCheckoutError(error instanceof Error ? error.message : "Checkout failed");
    }
  };

  return (
    <section className="mt-4 w-full space-y-4 pb-24">
      <MenuCategory
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      {filteredItems.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tassa kategoriassa ei ole tuotteita.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              quantityInCart={getItemQuantity(item.id)}
              onAddToCart={addItem}
            />
          ))}
        </div>
      )}
      <CartStickyBar itemCount={itemCount} subtotal={subtotal} onOpen={() => setIsDrawerOpen(true)} />
      <CheckoutDrawer
        isOpen={isDrawerOpen}
        items={cartItems}
        subtotal={subtotal}
        isCheckingOut={isCheckingOut}
        checkoutError={checkoutError}
        onClose={() => setIsDrawerOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onClear={clearCart}
        onCheckout={handleCheckout}
      />
    </section>
  );
}
