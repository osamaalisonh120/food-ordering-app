import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/redux/features/cart/cartSlice";
import { Extra } from "@prisma/client";
// import { db } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const { cart, shippingData } = await req.json();

    const lineItems = cart.map((item: CartItem) => {
      const extrasTotal =
        item.extras?.reduce(
          (sum: number, extra: Extra) => sum + extra.price,
          0
        ) || 0;

      const unitAmount =
        item.basePrice +
        (item.size?.price || 0) +
        extrasTotal;

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(unitAmount * 100),
        },
      };
    });

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: 500,
      },
    });


    const amount = lineItems.reduce(
      (
        total: number,
        item: {
          quantity: number;
          price_data: {
            unit_amount: number;
          };
        }
      ) => total + item.price_data.unit_amount * item.quantity,
      0
    );
//     const order = await db.order.create({
//       data: {
//         paid: false,

//         userEmail: "guest@example.com",

//         phone: shippingData?.phone || "",
// streetAddress: shippingData?.streetAddress || "",
// postalCode: shippingData?.postalCode || "",
// city: shippingData?.city || "",
// country: shippingData?.country || "",

//         subTotal: amount / 100 - 5,
//         deliveryFee: 5,
//         totalPrice: amount / 100,
//       },
//     });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",

      metadata: {
        // orderId: order.id,

     phone: shippingData?.phone || "",
streetAddress: shippingData?.streetAddress || "",
postalCode: shippingData?.postalCode || "",
city: shippingData?.city || "",
country: shippingData?.country || "",
      },

      automatic_payment_methods: {
        enabled: true,
      },
    });
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  }
  catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}