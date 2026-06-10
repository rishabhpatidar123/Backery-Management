import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weightLabel?: string;
  customizationNotes?: string;
  lineKey?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number, options?: Partial<CartItem>) => void;
  removeFromCart: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  totalItems: number;
  getCustomizationSummary: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function makeLineKey(
  id: string,
  weightLabel?: string,
  customizationNotes?: string
) {
  return `${id}::${weightLabel ?? ""}::${customizationNotes ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        setCartItems(
          parsed.map((item) => ({
            ...item,
            lineKey:
              item.lineKey ??
              makeLineKey(item.id, item.weightLabel, item.customizationNotes),
          }))
        );
      } catch (e) {
        console.error("Failed to parse cart storage", e);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const addToCart = (
    product: any,
    quantity: number = 1,
    options?: Partial<CartItem>
  ) => {
    const prodId = product._id || product.id;
    const weightLabel = options?.weightLabel;
    const customizationNotes = options?.customizationNotes;
    const lineKey = makeLineKey(prodId, weightLabel, customizationNotes);
    const price = options?.price ?? product.price;
    const existingItem = cartItems.find((item) => item.lineKey === lineKey);

    let updated: CartItem[];
    if (existingItem) {
      updated = cartItems.map((item) =>
        item.lineKey === lineKey
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [
        ...cartItems,
        {
          id: prodId,
          name: product.name,
          price,
          image: product.image || options?.image || "",
          quantity,
          weightLabel,
          customizationNotes,
          lineKey,
        },
      ];
    }

    saveCart(updated);
    const label = weightLabel ? ` (${weightLabel})` : "";
    toast({
      title: "Added to Cart!",
      description: `${product.name}${label} has been added to your cart.`,
    });
  };

  const removeFromCart = (lineKey: string) => {
    const item = cartItems.find((i) => i.lineKey === lineKey);
    const updated = cartItems.filter((item) => item.lineKey !== lineKey);
    saveCart(updated);
    if (item) {
      toast({
        title: "Removed from Cart",
        description: `${item.name} has been removed.`,
      });
    }
  };

  const updateQuantity = (lineKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineKey);
      return;
    }
    const updated = cartItems.map((item) =>
      item.lineKey === lineKey ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getCustomizationSummary = () => {
    const notes = cartItems
      .filter((i) => i.customizationNotes || i.weightLabel)
      .map((i) => {
        const parts = [i.name];
        if (i.weightLabel) parts.push(i.weightLabel);
        if (i.customizationNotes) parts.push(i.customizationNotes);
        return parts.join(" — ");
      });
    return notes.length ? `[Order notes: ${notes.join("; ")}]` : "";
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        totalItems,
        getCustomizationSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
