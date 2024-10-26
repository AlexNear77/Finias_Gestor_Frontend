// ProductDetailsModal.tsx
import React from "react";
import { useGetProductByIdQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Edit2Icon, Trash2Icon } from "lucide-react";

type ProductDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onDelete: (productId: string) => void;
  onUpdate: (productId: string) => void;
};

const ProductDetailsModal = ({
  isOpen,
  onClose,
  productId,
  onDelete,
  onUpdate,
}: ProductDetailsModalProps) => {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);
  const [imageError, setImageError] = React.useState(false);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white p-4 rounded">Loading...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
        <div className="bg-white p-4 rounded">
          Failed to load product details
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Product Details" />
        <div className="mt-5">
          {/* IMAGE */}
          <div className="flex justify-center">
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
          </div>

          {/* PRODUCT NAME */}
          <h3 className="text-lg font-semibold">{product.name}</h3>

          {/* PRICE */}
          <p className="mt-2">Price: ${product.price.toFixed(2)}</p>

          {/* DESCRIPTION */}
          {product.description && <p className="mt-2">{product.description}</p>}

          {/* GENDER */}
          {product.gender && <p className="mt-2">Gender: {product.gender}</p>}

          {/* STOCK QUANTITY */}
          <p>Stock Quantity: {product.stockQuantity}</p>

          {/* SIZES */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Available Sizes:</p>
              <ul className="list-disc list-inside">
                {product.sizes.map((size) => (
                  <li key={size.id}>
                    Size {size.size}: {size.stockQuantity} in stock
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RATING */}
          {product.rating && (
            <div className="flex items-center mt-2">
              <Rating rating={product.rating} />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex mt-4 space-x-2">
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
              onClick={onClose}
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
