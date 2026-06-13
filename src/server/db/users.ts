// import { cache } from "@/lib/cache";
// import { db } from "@/lib/prisma";

// export const getUsers = cache(
//   () => {
//     const users = db.user.findMany();
//     return users;
//   },
//   ["users"],
//   { revalidate: 3600 }
// );
// export const getUser = cache(
//   (userId: string) => {
//     const user = db.user.findUnique({ where: { id: userId } });
//     return user;
//   },
//   [`user-${crypto.randomUUID()}`],
//   { revalidate: 3600 }
// );
import { db } from "@/lib/prisma";

export const getUsers = async () => {
  return await db.user.findMany();
};

export const getUser = async (userId: string) => {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
  });
};