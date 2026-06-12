"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { clearCart } from "@/redux/features/cart/cartSlice";

export default function SuccessPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.history.replaceState(
      {},
      "",
      "/en/success"
    );

    const orderCreated =
      sessionStorage.getItem("orderCreated");

    // if (orderCreated) {
    //   return;
    // }
if (orderCreated) {
  dispatch(clearCart());
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingData");
  return;
}


    console.log("SUCCESS PAGE LOADED");

    const cart = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    const shippingData = JSON.parse(
      localStorage.getItem("shippingData") || "{}"
    );
if (!cart.length) {
  dispatch(clearCart());
  localStorage.removeItem("cartItems");
  console.log("CART IS EMPTY");
  return;
}
    console.log("CART:", cart);
    console.log("SHIPPING:", shippingData);

    // if (!cart.length) {
    //   console.log("CART IS EMPTY");
    //   return;
    // }

    const createOrder = async () => {
      console.log("CREATING ORDER...");

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          shippingData,
        }),
      });

      const data = await response.json();

      console.log("ORDER RESPONSE:", data);

      if (data.success) {
        dispatch(clearCart());

        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingData");

        sessionStorage.setItem(
          "orderCreated",
          "true"
        );

        console.log("CART CLEARED");
      }
    };

    createOrder();
  }, [dispatch]);

  return (
    <main className="container py-20 text-center">
      <h1 className="text-4xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      <p className="mt-4">
        Your order has been received.
      </p>
    </main>
  );
}