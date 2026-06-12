'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import {
  loadCartItems,
  CartItem,
} from '@/redux/features/cart/cartSlice';

export default function CartLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');

    if (storedCart) {
      dispatch(loadCartItems(JSON.parse(storedCart) as CartItem[]));
    }
  }, [dispatch]);

  return null;
}