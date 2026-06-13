// import { cache } from "@/lib/cache";
// import { db } from "@/lib/prisma";

// export const getCategories = cache(
//   () => {
//     const categories = db.category.findMany({
//       orderBy: {
//         order: "asc",
//       },
//     });
//     return categories;
//   },
//   ["categories"],
//   { revalidate: 3600 }
// );
import { db } from "@/lib/prisma";

export const getCategories = async () => {
  return await db.category.findMany({
    orderBy: {
      order: "asc",
    },
  });
};