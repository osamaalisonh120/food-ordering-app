import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.orderProduct.deleteMany(); // احذف المنتجات المرتبطة بالطلب أولاً
  await db.order.deleteMany(); // ثم احذف الطلبات

  console.log("All orders deleted");
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });