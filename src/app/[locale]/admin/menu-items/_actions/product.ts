// "use server";

// import { Pages, Routes } from "@/constants/enums";
// import { getCurrentLocale } from "@/lib/getCurrentLocale";
// import { db } from "@/lib/prisma";
// import getTrans from "@/lib/translation";
// import {
//   addProductSchema,
//   updateProductSchema,
// } from "@/validations/product";
// import { Extra, Size } from "@prisma/client";
// import { revalidatePath } from "next/cache";

// export const addProduct = async (
//   args: {
//     categoryId: string;
//     options: {
//       sizes: Partial<Size>[];
//       extras: Partial<Extra>[];
//     };
//   },
//   prevState: unknown,
//   formData: FormData
// ) => {
//   const locale = await getCurrentLocale();
//   const translations = await getTrans(locale);

//   const result = addProductSchema(translations).safeParse(
//     Object.fromEntries(formData.entries())
//   );

//   if (!result.success) {
//     return {
//       error: result.error.formErrors.fieldErrors,
//       status: 400,
//       formData,
//     };
//   }

//   const data = result.data;
//   const basePrice = Number(data.basePrice);
//   const imageFile = data.image as File;

//   const imageUrl = Boolean(imageFile.size)
//     ? await getImageUrl(imageFile)
//     : undefined;

//   try {
//     if (imageUrl) {
//       await db.product.create({
//         data: {
//           ...data,
//           image: imageUrl,
//           basePrice,
//           categoryId: args.categoryId,

//           sizes: {
//             createMany: {
//               data: args.options.sizes.map((size) => ({
//                 name: String(size.name),
//                 price: Number(size.price),
//               })),
//             },
//           },

//           extras: {
//             createMany: {
//               data: args.options.extras.map((extra) => ({
//                 name: String(extra.name),
//                 price: Number(extra.price),
//               })),
//             },
//           },
//         },
//       });

//       revalidatePath(`/${locale}/${Routes.MENU}`);
//       revalidatePath(
//         `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`
//       );
//       revalidatePath(`/${locale}`);

//       return {
//         status: 201,
//         message: translations.messages.productAdded,
//       };
//     }

//     return {};
//   } catch (error) {
//     console.error(error);

//     return {
//       status: 500,
//       message: translations.messages.unexpectedError,
//     };
//   }
// };

// export const updateProduct = async (
//   args: {
//     productId: string;
//     options: {
//       sizes: Partial<Size>[];
//       extras: Partial<Extra>[];
//     };
//   },
//   prevState: unknown,
//   formData: FormData
// ) => {
//   const locale = await getCurrentLocale();
//   const translations = await getTrans(locale);

//   const result = updateProductSchema(translations).safeParse(
//     Object.fromEntries(formData.entries())
//   );

//   if (!result.success) {
//     return {
//       error: result.error.formErrors.fieldErrors,
//       status: 400,
//       formData,
//     };
//   }

//   const data = result.data;
//   const basePrice = Number(data.basePrice);
//   const imageFile = data.image as File;

//   const imageUrl = Boolean(imageFile.size)
//     ? await getImageUrl(imageFile)
//     : undefined;

//   const product = await db.product.findUnique({
//     where: {
//       id: args.productId,
//     },
//   });

//   if (!product) {
//     return {
//       status: 400,
//       message: translations.messages.unexpectedError,
//     };
//   }

//   try {
//     const updatedProduct = await db.product.update({
//       where: {
//         id: args.productId,
//       },
//       data: {
//         ...data,
//         basePrice,
//         image: imageUrl ?? product.image,
//       },
//     });

//     await db.size.deleteMany({
//       where: {
//         productId: args.productId,
//       },
//     });

//     await db.size.createMany({
//       data: args.options.sizes.map((size) => ({
//         productId: args.productId,
//         name: String(size.name),
//         price: Number(size.price),
//       })),
//     });

//     await db.extra.deleteMany({
//       where: {
//         productId: args.productId,
//       },
//     });

//     await db.extra.createMany({
//       data: args.options.extras.map((extra) => ({
//         productId: args.productId,
//         name: String(extra.name),
//         price: Number(extra.price),
//       })),
//     });

//     revalidatePath(`/${locale}/${Routes.MENU}`);
//     revalidatePath(
//       `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`
//     );
//     revalidatePath(
//       `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`
//     );
//     revalidatePath(`/${locale}`);

//     return {
//       status: 200,
//       message: translations.messages.updateProductSucess,
//     };
//   } catch (error) {
//     console.error(error);

//     return {
//       status: 500,
//       message: translations.messages.unexpectedError,
//     };
//   }
// };

// const getImageUrl = async (imageFile: File) => {
//   const formData = new FormData();

//   formData.append("file", imageFile);
//   formData.append("pathName", "product_images");

//   try {
//     const response = await fetch(
//       `/api/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const image = (await response.json()) as {
//       url: string;
//     };

//     return image.url;
//   } catch (error) {
//     console.error(
//       "Error uploading file to Cloudinary:",
//       error
//     );
//   }
// };

// export const deleteProduct = async (id: string) => {
//   const locale = await getCurrentLocale();
//   const translations = await getTrans(locale);

//   try {
//     await db.product.delete({
//       where: { id },
//     });

//     revalidatePath(`/${locale}/${Routes.MENU}`);
//     revalidatePath(
//       `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`
//     );
//     revalidatePath(
//       `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`
//     );
//     revalidatePath(`/${locale}`);

//     return {
//       status: 200,
//       message: translations.messages.deleteProductSucess,
//     };
//   } catch (error) {
//     console.error(error);

//     return {
//       status: 500,
//       message: translations.messages.unexpectedError,
//     };
//   }
// };
"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import {
  addProductSchema,
  updateProductSchema,
} from "@/validations/product";
import { Extra, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProduct = async (
  args: {
    categoryId: string;
    options: {
      sizes: Partial<Size>[];
      extras: Partial<Extra>[];
    };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  console.log("FORM DATA:", Object.fromEntries(formData.entries()));

  const result = addProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    console.log("VALIDATION ERROR:", result.error.formErrors.fieldErrors);

    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }

  const data = result.data;
  console.log("PARSED DATA:", data);

  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;

  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  console.log("IMAGE URL:", imageUrl);

  try {
    if (imageUrl) {
      console.log("CREATING PRODUCT...");

      await db.product.create({
        data: {
          ...data,
          image: imageUrl,
          basePrice,
          categoryId: args.categoryId,

          sizes: {
            createMany: {
              data: args.options.sizes.map((size) => ({
                name: String(size.name),
                price: Number(size.price),
              })),
            },
          },

          extras: {
            createMany: {
              data: args.options.extras.map((extra) => ({
                name: String(extra.name),
                price: Number(extra.price),
              })),
            },
          },
        },
      });

      console.log("PRODUCT CREATED SUCCESSFULLY");

      revalidatePath(`/${locale}/${Routes.MENU}`);
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      revalidatePath(`/${locale}`);

      return {
        status: 201,
        message: translations.messages.productAdded,
      };
    }

    console.log("NO IMAGE URL RETURNED");

    return {};
  } catch (error) {
    console.error("DB CREATE ERROR:", error);

    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

export const updateProduct = async (
  args: {
    productId: string;
    options: {
      sizes: Partial<Size>[];
      extras: Partial<Extra>[];
    };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  const result = updateProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;

  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  const product = await db.product.findUnique({
    where: {
      id: args.productId,
    },
  });

  if (!product) {
    return {
      status: 400,
      message: translations.messages.unexpectedError,
    };
  }

  try {
    const updatedProduct = await db.product.update({
      where: {
        id: args.productId,
      },
      data: {
        ...data,
        basePrice,
        image: imageUrl ?? product.image,
      },
    });

    await db.size.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await db.size.createMany({
      data: args.options.sizes.map((size) => ({
        productId: args.productId,
        name: String(size.name),
        price: Number(size.price),
      })),
    });

    await db.extra.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await db.extra.createMany({
      data: args.options.extras.map((extra) => ({
        productId: args.productId,
        name: String(extra.name),
        price: Number(extra.price),
      })),
    });

    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);

    return {
      status: 200,
      message: translations.messages.updateProductSucess,
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();

  formData.append("file", imageFile);
  formData.append("pathName", "product_images");

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log("UPLOAD RESPONSE STATUS:", response.status);

    const image = (await response.json()) as {
      url: string;
    };

    console.log("UPLOADED IMAGE:", image);

    return image.url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
  }
};

export const deleteProduct = async (id: string) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  try {
    await db.product.delete({
      where: { id },
    });

    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);

    return {
      status: 200,
      message: translations.messages.deleteProductSucess,
    };
  } catch (error) {
    console.error(error);

    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};