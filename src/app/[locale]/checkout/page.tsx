// "use client";

// import { useEffect, useState } from "react";
// import PaymentForm from "./_components/PaymentForm";
// import StripeWrapper from "./_components/StripeWrapper";

// export default function CheckoutPage() {
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           cart: [],
//         }),
//       });

//       const data = await response.json();

//       setClientSecret(data.clientSecret);
//     };

//     createPaymentIntent();
//   }, []);

//   if (!clientSecret) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <main>
//       <section>
//         <StripeWrapper clientSecret={clientSecret}>
//           <PaymentForm />
//         </StripeWrapper>
//       </section>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import PaymentForm from "./_components/PaymentForm";
import StripeWrapper from "./_components/StripeWrapper";

type ShippingData = {
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);

useEffect(() => {
 const savedShippingData =
  localStorage.getItem("shippingData");

const savedCart =
  localStorage.getItem("cartItems");

if (savedShippingData && savedCart) {
  const parsedShippingData =
    JSON.parse(savedShippingData);

  const parsedCart =
    JSON.parse(savedCart);

  setShippingData(parsedShippingData);

  const createPaymentIntent = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: parsedCart,
        shippingData: parsedShippingData,
      }),
    });

    const data = await response.json();

    console.log("API Response:", data);

    setClientSecret(data.clientSecret);
  };

  createPaymentIntent();
}
}, []);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container py-10">
      {shippingData && (
        <div className="mb-8 p-4 border rounded-md">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

          <p>
            <strong>Phone:</strong> {shippingData.phone}
          </p>

          <p>
            <strong>Address:</strong> {shippingData.streetAddress}
          </p>

          <p>
            <strong>Postal Code:</strong> {shippingData.postalCode}
          </p>

          <p>
            <strong>City:</strong> {shippingData.city}
          </p>

          <p>
            <strong>Country:</strong> {shippingData.country}
          </p>
        </div>
      )}

      <StripeWrapper clientSecret={clientSecret}>
        <PaymentForm />
      </StripeWrapper>
    </main>
  );
}
