"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/state/api";
import {
  PlusCircleIcon,
  SearchIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import ProductDetailsModal from "./ProductDetailsModal";

type ProductFormData = {
  productId?: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  // slug
  // description
  // size
  // gender
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
          Product
        </button>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products.map((product) => (
          <div
            key={product.productId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              {/* Placeholder para la imagen */}
              <div>img</div>
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              )}
              {/* Botones de acciones */}
              <div className="flex mt-4 space-x-2">
                <button
                  onClick={() => {
                    setSelectedProductId(product.productId);
                    setIsDetailsModalOpen(true);
                  }}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setSelectedProductId(product.productId);
                    setIsUpdateModalOpen(true);
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                >
                  <Edit2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALES */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      {selectedProductId && (
        <UpdateProductModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          productId={selectedProductId}
        />
      )}

      {selectedProductId && (
        <ProductDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;

{
  /* <Image
                  src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${
                    Math.floor(Math.random() * 3) + 1
                  }.png`}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                /> */
}
