// components/BranchFormModal.tsx

import React, { useState, ChangeEvent, FormEvent } from "react";

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (branchData: Partial<Branch>) => void;
  initialData?: Branch | null;
}

export interface Branch {
  branchId: string;
  name: string;
  location: string;
}

const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Branch>>({
    name: initialData?.name || "",
    location: initialData?.location || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700 mt-4";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

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
          <h2 className="text-xl font-semibold">
            {initialData ? "Editar Sucursal" : "Crear Sucursal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <label htmlFor="name" className={labelCssStyles}>
            Nombre
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre de la sucursal"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          <label htmlFor="location" className={labelCssStyles}>
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            placeholder="Ubicación de la sucursal"
            onChange={handleChange}
            value={formData.location}
            className={inputCssStyles}
            required
          />

          <div className="px-6 py-4 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchFormModal;
