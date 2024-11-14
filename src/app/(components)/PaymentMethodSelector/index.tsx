// components/PaymentMethodSelector.tsx

import React from "react";
import { PaymentMethod } from "@/state/api";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Método de Pago
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentMethod)}
        className="p-2 border rounded mt-1"
      >
        <option value="CASH">Efectivo</option>
        <option value="CREDIT_CARD">Tarjeta de Crédito</option>
        <option value="DEBIT_CARD">Tarjeta de Débito</option>
        <option value="MOBILE_PAYMENT">Pago Móvil</option>
      </select>
    </div>
  );
};

export default PaymentMethodSelector;
