// import cloudinary from "@/lib/cloudinary";
// import { NextResponse } from "next/server";

// // Define the type for the form data file
// type FormDataFile = Blob & {
//   name?: string; // Optional: Some browsers may add this
// };

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as FormDataFile | null;
//     const pathName = formData.get("pathName") as string;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }
//     // Convert the file to a format Cloudinary can handle (Buffer or Base64)
//     const fileBuffer = await file.arrayBuffer();
//     const base64File = Buffer.from(fileBuffer).toString("base64");
//     // Upload to Cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(
//       `data:${file.type};base64,${base64File}`,
//       {
//         folder: pathName,
//         transformation: [
//           { width: 200, height: 200, crop: "fill", gravity: "face" },
//         ],
//       }
//     );
//     return NextResponse.json({ url: uploadResponse.secure_url });
//   } catch (error) {
//     console.error("Error uploading file to Cloudinary:", error);
//     return NextResponse.json(
//       { error: "Failed to upload image" },
//       { status: 500 }
//     );
//   }
// }
import cloudinary from "@/lib/cloudinary";

import { NextResponse } from "next/server";

type FormDataFile = Blob & {
  name?: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as FormDataFile | null;

    const pathName = formData.get("pathName") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const base64File = buffer.toString("base64");

    const dataURI = `data:${file.type};base64,${base64File}`;

    const uploadedImage = await cloudinary.uploader.upload(dataURI, {
      folder: pathName || "uploads",
    });

    return NextResponse.json({
      url: uploadedImage.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to upload image",
      },
      {
        status: 500,
      }
    );
  }
}