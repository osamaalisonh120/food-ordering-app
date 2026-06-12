import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { getSubTotal } from "@/lib/cart";
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

console.log("SESSION:", session);

const { cart, shippingData } = await req.json();
  const subTotal = getSubTotal(cart);

    const deliveryFee = 5;

    const order = await db.order.create({
      data: {
        paid: true,

        userEmail:
          session?.user?.email || "guest@example.com",

        userId: session?.user?.id || null,

        phone: shippingData.phone,
        streetAddress: shippingData.streetAddress,
        postalCode: shippingData.postalCode,
        city: shippingData.city,
        country: shippingData.country,

        subTotal,
        deliveryFee,
        totalPrice: subTotal + deliveryFee,
      },
    });

    for (const item of cart) {
      await db.orderProduct.create({
        data: {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity || 1,

          userId: session?.user?.id || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}