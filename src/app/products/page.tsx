"use client";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, QrCodeIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
import QrModal from "@/app/(components)/QrModal";
import QrScannerModal from "../(components)/QrScannerModal";
import ProductItem from "./ProductItem";
import BranchSelect from "../(components)/BranchSelect";

type ProductFormData = {
  productId?: string;
  name: string;
  price: number;
  rating: number;
  description?: string;
  gender?: string;
  sizes?: {
    size: string;
    stockQuantity: number;
  }[];
  imageUrl?: string;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 16;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  const { data, isLoading, isError } = useGetProductsQuery({
    search: searchTerm,
    page,
    limit,
    branchId: selectedBranchId || undefined,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Quieres eliminar este producto? Esta acción no se puede deshacer."
    );
    if (confirmDelete) {
      await deleteProduct(productId);
      setIsDetailsModalOpen(false);
    }
  };

  const handleOpenQrModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsQrModalOpen(true);
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranchId(value);
    setPage(1); // Reinicia a la primera página al cambiar de sucursal
  };

  const handleScanSuccess = (productId: string) => {
    setIsQrScannerOpen(false);
    const productExists = products.some(
      (product) => product.productId === productId
    );

    if (productExists) {
      setSelectedProductId(productId);
      setIsDetailsModalOpen(true);
    } else {
      alert("Product not found.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reinicia a la primera página al buscar
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
        <div className="flex items-center justify-between">
          <div className="flex items-center border-2 border-gray-200 rounded">
            <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
            <input
              className="w-full py-2 px-4 rounded bg-white"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <BranchSelect
            value={selectedBranchId}
            onChange={handleBranchChange}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <div className="flex items-center">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
            Product
          </button>
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() => setIsQrScannerOpen(true)}
          >
            <QrCodeIcon className="w-5 h-5 mr-2" /> Scan QR
          </button>
        </div>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-between">
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
            onGenerateQr={(productId: string) => {
              handleOpenQrModal(productId);
            }}
          />
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 mx-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 mx-2 rounded ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* MODALES */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
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
          onDelete={handleDeleteProduct}
          onUpdate={(productId: string) => {
            setSelectedProductId(productId);
            setIsUpdateModalOpen(true);
            setIsDetailsModalOpen(false); // Close the details modal
          }}
          onGenerateQr={(productId: string) => {
            handleOpenQrModal(productId);
            setIsDetailsModalOpen(false); // Optional: close the details modal
          }}
        />
      )}

      {selectedProductId && (
        <QrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          productId={selectedProductId}
        />
      )}
    </div>
  );
};

export default Products;
