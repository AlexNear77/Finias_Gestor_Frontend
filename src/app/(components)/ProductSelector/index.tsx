// components/ProductSelector.tsx

import React, { useState, useEffect } from "react";
import { useGetProductsQuery, Product, ProductSize } from "@/state/api";
import QrScannerModal from "../QrScannerModal";

interface ProductSelectorProps {
  onAddItem: (item: {
    productId: string;
    size: string;
    quantity: number;
    product?: Product;
  }) => void;
  branchId: string; // Para filtrar productos por sucursal
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  onAddItem,
  branchId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: productsData, isLoading } = useGetProductsQuery({
    branchId: branchId || undefined,
    page: 1,
    limit: 1000, // Obtener todos los productos de la sucursal
  });
  const products = productsData?.products || [];
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    if (selectedProduct) {
      setAvailableSizes(selectedProduct.sizes || []);
      setSelectedSize("");
    }
  }, [selectedProduct]);

  const handleAdd = () => {
    if (!selectedProduct) {
      alert("Debe seleccionar un producto.");
      return;
    }

    if (!selectedSize) {
      alert("Debe seleccionar un tamaño.");
      return;
    }

    if (quantity <= 0) {
      alert("La cantidad debe ser mayor que cero.");
      return;
    }

    // Verificar que la cantidad no exceda el stock disponible
    const selectedSizeInfo = availableSizes.find(
      (ps) => ps.size === selectedSize
    );
    if (!selectedSizeInfo || quantity > selectedSizeInfo.stockQuantity) {
      alert(
        `La cantidad solicitada excede el stock disponible (${
          selectedSizeInfo?.stockQuantity || 0
        }).`
      );
      return;
    }

    onAddItem({
      productId: selectedProduct.productId,
      size: selectedSize,
      quantity,
      product: selectedProduct,
    });

    // Resetear los campos
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
    setSearchTerm("");
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setFilteredProducts([]);
  };

  const handleScanSuccess = (productId: string) => {
    setIsQrScannerOpen(false);
    const product = products.find(
      (p) => p.productId.toLowerCase() === productId.toLowerCase()
    );
    if (product) {
      setSelectedProduct(product);
      setSearchTerm(product.name);
      setFilteredProducts([]);
    } else {
      alert(`Producto con ID ${productId} no encontrado en esta sucursal.`);
    }
  };

  if (!branchId) {
    return (
      <p>
        Por favor, seleccione una sucursal para mostrar los productos
        disponibles.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Agregar Producto a la Venta
      </h2>
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Busque un producto por nombre o ID"
              className="p-2 border rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredProducts.length > 0 && (
              <ul className="absolute bg-white border rounded w-full mt-1 z-10 max-h-56 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <li
                    key={product.productId}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    {product.name} (ID: {product.productId})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Escanear QR
          </button>
        </div>
      )}

      {selectedProduct && (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Producto Seleccionado: {selectedProduct.name} (ID:{" "}
            {selectedProduct.productId})
          </p>
          <div className="mt-2 flex items-center space-x-4">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Seleccione un tamaño</option>
              {availableSizes.map((size) => (
                <option key={size.id} value={size.size}>
                  {size.size} (Stock: {size.stockQuantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="p-2 border rounded w-20"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Escanear QR */}
      {isQrScannerOpen && (
        <QrScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
};

export default ProductSelector;
