// components/ProductSelector.tsx

import React, { useState, useEffect } from "react";
import { useGetProductsQuery, Product, ProductSize } from "@/state/api";

interface ProductSelectorProps {
  onAddItem: (item: {
    productId: string;
    size: string;
    quantity: number;
    product?: Product;
  }) => void;
  branchId: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  onAddItem,
  branchId,
}) => {
  const { data: productsData, isLoading } = useGetProductsQuery({
    branchId: branchId || undefined, // Pasamos branchId al query
    page: 1,
    limit: 10, // Obtener todos los productos de la sucursal
  });
  const products = productsData?.products || [];
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.productId === selectedProductId);
      setSelectedProduct(product);
      setAvailableSizes(product?.sizes || []);
      setSelectedSize("");
    }
  }, [selectedProductId, products]);

  const handleAdd = () => {
    if (!selectedProductId || !selectedSize || quantity <= 0) {
      alert("Debe seleccionar un producto, tamaño y cantidad válida.");
      return;
    }

    // Verificar que la cantidad no exceda el stock disponible
    const selectedSizeInfo = availableSizes.find(
      (size) => size.size === selectedSize
    );
    if (selectedSizeInfo && quantity > selectedSizeInfo.stockQuantity) {
      alert(
        `La cantidad solicitada excede el stock disponible (${selectedSizeInfo.stockQuantity}).`
      );
      return;
    }

    onAddItem({
      productId: selectedProductId,
      size: selectedSize,
      quantity,
      product: selectedProduct,
    });

    // Resetear los campos
    setSelectedProductId("");
    setSelectedSize("");
    setQuantity(1);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Agregar Producto a la Venta</h2>
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="flex items-center space-x-4 mt-2">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Seleccione un producto</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name}
              </option>
            ))}
          </select>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="p-2 border rounded"
            disabled={!availableSizes.length}
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
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="p-2 border rounded w-20"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
