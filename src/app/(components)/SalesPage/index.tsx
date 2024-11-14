// components/SalesPage.tsx

import React, { useState } from "react";
import { useCreateSaleMutation, Product, PaymentMethod } from "@/state/api";
import ProductSelector from "../ProductSelector";
import PaymentMethodSelector from "../PaymentMethodSelector";
import BranchSelect from "../BranchSelect";
import ConfirmationModal from "../ConfirmationModal"; // Importar el nuevo componente de confirmación

const SalesPage = () => {
  const [saleItems, setSaleItems] = useState<
    Array<{
      productId: string;
      size: string;
      quantity: number;
      product?: Product;
    }>
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [selectedBranchId, setSelectedBranchId] = useState<string>(""); // Estado para la sucursal seleccionada
  const [createSale, { isLoading, error, isSuccess }] = useCreateSaleMutation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false); // Estado para el modal de confirmación

  const handleAddItem = (item: {
    productId: string;
    size: string;
    quantity: number;
    product?: Product;
  }) => {
    setSaleItems([...saleItems, item]);
  };

  const handleRemoveItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleSubmitSale = async () => {
    if (saleItems.length === 0) {
      alert("Debe agregar al menos un producto a la venta.");
      return;
    }

    // Abrir el modal de confirmación
    setIsConfirmationOpen(true);
  };

  const confirmSale = async () => {
    try {
      await createSale({
        items: saleItems.map(({ productId, size, quantity }) => ({
          productId,
          size,
          quantity,
        })),
        paymentMethod,
      }).unwrap();

      alert("Venta realizada con éxito.");
      setSaleItems([]);
      setIsConfirmationOpen(false);
    } catch (err) {
      console.error("Error al crear la venta:", err);
      alert("Ocurrió un error al realizar la venta.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Punto de Venta</h1>
      {/* Selector de Sucursal */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Sucursal
        </label>
        <BranchSelect value={selectedBranchId} onChange={setSelectedBranchId} />
      </div>
      {/* Pasar la sucursal seleccionada al ProductSelector */}
      <ProductSelector onAddItem={handleAddItem} branchId={selectedBranchId} />
      <div className="mt-4">
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Productos en la Venta</h2>
          <table className="min-w-full bg-white mt-2">
            <thead>
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Tamaño</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {saleItems.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2">{item.product?.name}</td>
                  <td className="py-2">{item.size}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">
                    ${(item.product?.price ?? 0 * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmitSale}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Realizar Venta"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 mt-2">
              Error al realizar la venta: {error.toString()}
            </p>
          )}
          {isSuccess && (
            <p className="text-green-500 mt-2">Venta realizada con éxito.</p>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      {isConfirmationOpen && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          saleItems={saleItems}
          paymentMethod={paymentMethod}
          onConfirm={confirmSale}
        />
      )}
    </div>
  );
};

export default SalesPage;
