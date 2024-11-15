/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ImageUpload.tsx
"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  productId: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, productId }) => {
  return (
    <CldUploadWidget
      uploadPreset="ml_default" // Reemplaza con tu upload preset
      /* responsive */
      signatureEndpoint={`${process.env.NEXT_PUBLIC_API_BASE_URL}/cloudinary/sign-cloudinary-params`}
      options={{
        publicId: productId,
        clientAllowedFormats: ["png", "jpeg", "jpg"],
        maxFiles: 1,
        multiple: false,
      }}
      onSuccess={(result: any) => {
        const url = result.info.secure_url;
        onUpload(url);
      }}
    >
      {({ open }) => {
        function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
          e.preventDefault();
          open();
        }
        return (
          <button
            type="button"
            onClick={handleOnClick}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
