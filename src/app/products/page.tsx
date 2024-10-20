"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductItem from "./ProductItem";

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
          <ProductItem
            key={product.productId}
            product={product}
            onDelete={handleDeleteProduct}
            onViewDetails={(productId: string) => {
              setSelectedProductId(productId);
              setIsDetailsModalOpen(true);
            }}
            onUpdate={(productId: string) => {
              setSelectedProductId(productId);
              setIsUpdateModalOpen(true);
            }}
          />
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
