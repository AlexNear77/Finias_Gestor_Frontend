"use client";

import React, { useEffect } from "react";
import { useGetProductByIdQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Edit2Icon, Trash2Icon, QrCodeIcon, XIcon } from "lucide-react";

type ProductDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onDelete: (productId: string) => void;
  onUpdate: (productId: string) => void;
  onGenerateQr: (productId: string) => void;
};

export default function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  onDelete,
  onUpdate,
  onGenerateQr,
}: ProductDetailsModalProps) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    setImageError(false);
  }, [productId]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-xl">
          <p className="text-lg font-semibold text-red-600">
            Failed to load product details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-70"
      onClick={onClose} // Detecta clics fuera del modal y cierra el modal
    >
      <div
        className="relative mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Evita que los clics dentro del modal lo cierren
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <Header name="Product Details" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center">
            {!imageError ? (
              <CldImage
                src={product.productId}
                alt={product.name}
                width={300}
                height={300}
                crop="fill"
                gravity="auto"
                onError={() => setImageError(true)}
                className="rounded-lg object-cover shadow-md"
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/alexnear/image/upload/v1728256364/no_image_product.png"
                alt="Imagen no disponible"
                width={300}
                height={300}
                className="rounded-lg object-cover shadow-md"
              />
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-2 text-3xl font-semibold text-primary">
                ${product.price.toFixed(2)}
              </p>
              {product.description && (
                <p className="mt-4 text-sm text-gray-600">
                  {product.description}
                </p>
              )}
              {product.gender && (
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Gender: {product.gender}
                </p>
              )}
              <p className="mt-2 text-sm font-medium text-gray-600">
                Stock Quantity: {product.stockQuantity}
              </p>
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700">
                    Available Sizes:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                      >
                        {size.size}: {size.stockQuantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.rating !== undefined && product.rating > 0 && (
                <div className="mt-4 flex items-center">
                  <Rating rating={product.rating} />
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rating})
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onUpdate(product.productId)}
                className="flex items-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-lg"
              >
                <Edit2Icon className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
                Update
              </button>
              <button
                onClick={() => onDelete(product.productId)}
                className="flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-lg"
              >
                <Trash2Icon className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
                Delete
              </button>
              <button
                onClick={() => onGenerateQr(product.productId)}
                className="flex items-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:px-6 sm:py-3 sm:text-lg"
              >
                <QrCodeIcon className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
                QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
