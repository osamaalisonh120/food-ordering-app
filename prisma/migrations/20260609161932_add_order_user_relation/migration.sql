-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "stripeSessionId" TEXT,
    "stripePaymentId" TEXT,
    "subTotal" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("city", "country", "createdAt", "deliveryFee", "id", "paid", "phone", "postalCode", "streetAddress", "stripePaymentId", "stripeSessionId", "subTotal", "totalPrice", "updatedAt", "userEmail") SELECT "city", "country", "createdAt", "deliveryFee", "id", "paid", "phone", "postalCode", "streetAddress", "stripePaymentId", "stripeSessionId", "subTotal", "totalPrice", "updatedAt", "userEmail" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
