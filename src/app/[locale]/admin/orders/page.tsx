import { db } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Orders ({orders.length})
      </h1>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Phone</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b text-center">
                Paid
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-4 border-b">
                  {order.userEmail}
                </td>

                <td className="p-4 border-b">
                  {order.phone}
                </td>

                <td className="p-4 border-b font-semibold">
                  ${order.totalPrice}
                </td>

                <td className="p-4 border-b text-center">
                  {order.paid ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}