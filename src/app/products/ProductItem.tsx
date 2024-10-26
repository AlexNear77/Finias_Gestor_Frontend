/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductItem.tsx
import React, { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Edit2Icon, Trash2Icon, QrCodeIcon } from "lucide-react";

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
    <div className="border shadow rounded-md p-4 max-w-full w-full mx-auto">
      <div className="flex flex-col items-center">
        {!imageError ? (
          <CldImage
            src={product.productId}
            alt={product.name}
            width={300}
            height={300}
            crop="fill"
            gravity="auto"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src="https://res.cloudinary.com/alexnear/image/upload/v1728256364/no_image_product.png"
            alt="Imagen no disponible"
            width={300}
            height={300}
          />
        )}
        <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
        <p className="mt-1 text-gray-600">${product.price.toFixed(2)}</p>
        <div className="flex mt-4 space-x-2">
          <button
            onClick={() => onViewDetails(product.productId)}
            className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Details
          </button>
          <button
            onClick={() => onUpdate(product.productId)}
            className="flex items-center px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
          >
            <Edit2Icon className="w-4 h-4 mr-1" />
            Update
          </button>
          <button
            onClick={() => onDelete(product.productId)}
            className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          >
            <Trash2Icon className="w-4 h-4 mr-1" />
            Delete
          </button>
          <button
            onClick={() => onGenerateQr(product.productId)}
            className="flex items-center px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
          >
            <QrCodeIcon className="w-4 h-4 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
