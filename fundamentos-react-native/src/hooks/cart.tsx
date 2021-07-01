import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsUpdate = await AsyncStorage.getItem('@GoMarketplace:Cart');

      if (productsUpdate) setProducts(JSON.parse(productsUpdate));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      let check = true;

      const productsUpdate = products.map(item => {
        if (item.id === product.id) {
          check = false;
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      if (check) productsUpdate.push({ ...product, quantity: 1 });

      setProducts(productsUpdate);

      await AsyncStorage.setItem(
        '@GoMarketplace:Cart',
        JSON.stringify(productsUpdate),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productsUpdate = products.map(product => {
        if (product.id === id)
          return { ...product, quantity: product.quantity + 1 };
        return product;
      });
      setProducts(productsUpdate);

      await AsyncStorage.setItem(
        '@GoMarketplace:Cart',
        JSON.stringify(productsUpdate),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productsUpdate = products
        .map(product => {
          if (product.id === id)
            return { ...product, quantity: product.quantity - 1 };
          return product;
        })
        .filter(product => product.quantity > 0);

      setProducts(productsUpdate);

      await AsyncStorage.setItem(
        '@GoMarketplace:Cart',
        JSON.stringify(productsUpdate),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
