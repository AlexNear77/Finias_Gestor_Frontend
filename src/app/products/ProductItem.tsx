/* eslint-disable @typescript-eslint/no-explicit-any */
// ProductItem.tsx
import { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Rating from "@/app/(components)/Rating";

const ProductItem = ({ product, onDelete, onViewDetails, onUpdate }: any) => {
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
        <h3 className="text-lg text-gray-900 font-semibold mt-2">
          {product.name}
        </h3>

        {/* PRECIO */}
        <p className="text-gray-800 mt-2">${product.price.toFixed(2)}</p>

        {/* GÉNERO */}
        {product.gender && (
          <p className="text-sm text-gray-600 mt-1">Gender: {product.gender}</p>
        )}

        {/* STOCK */}
        <div className="text-sm text-gray-600 mt-1">
          Stock: {product.stockQuantity}
        </div>

        {/* RATING */}
        {product.rating && (
          <div className="flex items-center mt-2">
            <Rating rating={product.rating} />
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="flex mt-4 space-x-2">
          <button
            onClick={() => onViewDetails(product.productId)}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
          >
            View
          </button>
          <button
            onClick={() => onUpdate(product.productId)}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
          >
            <Edit2Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.productId)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
