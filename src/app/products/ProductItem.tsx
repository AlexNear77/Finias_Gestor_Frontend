/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductItem.tsx
import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Edit2Icon, Trash2Icon, QrCodeIcon, EyeIcon } from "lucide-react";

interface ProductItemProps {
  product: any;
  onDelete: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  onUpdate: (productId: string) => void;
  onGenerateQr: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  onViewDetails,
  onUpdate,
  onGenerateQr,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        {!imageError ? (
          <CldImage
            src={product.productId}
            alt={product.name}
            width={400}
            height={400}
            crop="fill"
            gravity="auto"
            onError={() => setImageError(true)}
            /* className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" */
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src="https://res.cloudinary.com/alexnear/image/upload/v1728256364/no_image_product.png"
            alt="Imagen no disponible"
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            Price: ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 flex flex-col translate-x-full items-center space-y-2 bg-gradient-to-l from-black to-transparent p-4 transition-all duration-300 group-hover:translate-x-0">
        <button
          onClick={() => onViewDetails(product.productId)}
          className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 sm:p-4 sm:text-lg"
          title="View Details"
        >
          <EyeIcon className="h-10 w-10 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={() => onUpdate(product.productId)}
          className="rounded-full bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 sm:p-4 sm:text-lg"
          title="Update"
        >
          <Edit2Icon className="h-10 w-10 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={() => onDelete(product.productId)}
          className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 sm:p-4 sm:text-lg"
          title="Delete"
        >
          <Trash2Icon className="h-10 w-10 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={() => onGenerateQr(product.productId)}
          className="rounded-full bg-green-500 p-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:p-4 sm:text-lg"
          title="Generate QR"
        >
          <QrCodeIcon className="h-10 w-10 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
