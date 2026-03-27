'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import type { CartItem, CartState } from '@/types';

// ─── Actions ─────────────────────────────────────────────────
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] };

// ─── Reducer ─────────────────────────────────────────────────
function computeTotals(items: CartItem[]): Pick<CartState, 'totalItems' | 'totalPrice'> {
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload, ...computeTotals(action.payload) };

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      const items = existing
        ? state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i,
          )
        : [...state.items, action.payload];
      return { items, ...computeTotals(items) };
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.productId !== action.payload.productId);
      return { items, ...computeTotals(items) };
    }

    case 'UPDATE_QUANTITY': {
      const items = state.items
        .map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.max(0, action.payload.quantity) }
            : i,
        )
        .filter((i) => i.quantity > 0);
      return { items, ...computeTotals(items) };
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────
interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items: CartItem[] = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', payload: items });
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage errors
    }
  }, [state.items]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (productId: number) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  const updateQuantity = (productId: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
