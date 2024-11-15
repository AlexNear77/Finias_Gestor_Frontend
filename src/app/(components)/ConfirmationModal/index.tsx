// components/ConfirmationModal.tsx

import React from "react";
import { Product, PaymentMethod } from "@/state/api";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleItems: Array<{
    productId: string;
    size: string;
    quantity: number;
    product?: Product;
  }>;
  paymentMethod: PaymentMethod;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  saleItems,
  paymentMethod,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const totalAmount = saleItems.reduce(
    (total, item) => total + (item.product?.price ?? 0) * item.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Confirmar Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold mb-2">Detalles de la Venta</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Tamaño</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {saleItems.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2">
                    {item.product?.name ?? item.productId}
                  </td>
                  <td className="py-2">{item.size}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">
                    ${(item.product?.price ?? 0) * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </p>
            <p className="text-lg">
              Método de Pago:{" "}
              {paymentMethod === "CASH" ? "Efectivo" : paymentMethod}
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
