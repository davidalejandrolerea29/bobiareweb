import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { cartApi, AddCartItemPayload, CheckoutPayload, CheckoutResponse } from '../services/cartApi';
import { Order } from '../types';

interface CartContextType {
  cart: Order | null;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (payload: AddCartItemPayload) => Promise<void>;
  updateItem: (orderItemId: number, quantity: number) => Promise<void>;
  removeItem: (orderItemId: number) => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<CheckoutResponse>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const order = await cartApi.get();
      setCart(order);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial del carrito al montar — no depende de estado que el
    // propio efecto setee, no hay riesgo de loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (payload: AddCartItemPayload) => {
      await cartApi.addItem(payload);
      await refresh();
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (orderItemId: number, quantity: number) => {
      await cartApi.updateItem(orderItemId, quantity);
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (orderItemId: number) => {
      await cartApi.removeItem(orderItemId);
      await refresh();
    },
    [refresh]
  );

  const checkout = useCallback(
    async (payload: CheckoutPayload) => {
      const response = await cartApi.checkout(payload);
      await refresh();
      return response;
    },
    [refresh]
  );

  const totalItems = cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const totalPrice = cart ? Number(cart.total) : 0;

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, updateItem, removeItem, checkout, totalItems, totalPrice }),
    [cart, loading, refresh, addItem, updateItem, removeItem, checkout, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
