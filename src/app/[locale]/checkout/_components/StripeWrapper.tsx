"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/get-stripe";

export default function StripeWrapper({
  clientSecret,
  children,
}: {
  clientSecret: string;
  children: React.ReactNode;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      {children}
    </Elements>
  );
}