// components/BranchesPage.tsx

import React, { useState } from "react";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "@/state/api";
import BranchFormModal from "../BranchFormModal";

export interface Branch {
  branchId: string;
  name: string;
  location: string;
}

const BranchesPage = () => {
  const { data: branches, isLoading, isError } = useGetBranchesQuery();
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleCreate = async (branchData: Partial<Branch>) => {
    await createBranch(branchData);
    setIsModalOpen(false);
  };

  const handleUpdate = async (branchData: Partial<Branch>) => {
    if (selectedBranch) {
      await updateBranch({ ...branchData, branchId: selectedBranch.branchId });
      setIsModalOpen(false);
      setSelectedBranch(null);
    }
  };

  const handleDelete = async (branchId: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sucursal?"
    );
    if (confirmDelete) {
      await deleteBranch(branchId);
    }
  };

  if (isLoading) {
    return <div>Cargando sucursales...</div>;
  }

  if (isError || !branches) {
    return <div>Error al cargar las sucursales.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sucursales</h1>
      <button
        onClick={() => {
          setSelectedBranch(null);
          setIsModalOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Crear Sucursal
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Ubicación</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.branchId} className="text-center">
              <td className="py-2">{branch.name}</td>
              <td className="py-2">{branch.location}</td>
              <td className="py-2">
                <button
                  onClick={() => {
                    setSelectedBranch(branch);
                    setIsModalOpen(true);
                  }}
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(branch.branchId)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <BranchFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBranch(null);
          }}
          onSubmit={selectedBranch ? handleUpdate : handleCreate}
          initialData={selectedBranch}
        />
      )}
    </div>
  );
};

export default BranchesPage;
