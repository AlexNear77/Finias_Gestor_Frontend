// ProductDetailsModal.tsx
import React from "react";
import { useGetProductByIdQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";

type ProductDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
};

const ProductDetailsModal = ({
  isOpen,
  onClose,
  productId,
}: ProductDetailsModalProps) => {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);

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
          {/* PRODUCT NAME */}
          <h3 className="text-lg font-semibold">{product.name}</h3>

          {/* PRICE */}
          <p className="mt-2">Price: ${product.price.toFixed(2)}</p>

          {/* STOCK QUANTITY */}
          <p>Stock Quantity: {product.stockQuantity}</p>

          {/* RATING */}
          {product.rating && (
            <div className="flex items-center mt-2">
              <Rating rating={product.rating} />
            </div>
          )}

          {/* Placeholder para relaciones */}
          {/* Puedes mostrar información adicional si tus modelos incluyen más detalles */}

          {/* CLOSE ACTION */}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
