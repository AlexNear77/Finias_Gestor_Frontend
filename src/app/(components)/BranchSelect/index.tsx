// components/BranchSelect.tsx

import React from "react";
import { useGetBranchesQuery } from "@/state/api";

interface BranchSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const BranchSelect: React.FC<BranchSelectProps> = ({ value, onChange }) => {
  const { data: branches, isLoading, isError } = useGetBranchesQuery();

  if (isLoading) {
    return <p>Loading branches...</p>;
  }

  if (isError || !branches) {
    return <p>Error loading branches.</p>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full mb-2 p-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Seleccione Sucursal</option>
      {branches.map((branch) => (
        <option key={branch.branchId} value={branch.branchId}>
          {branch.name} - {branch.location}
        </option>
      ))}
    </select>
  );
};

export default BranchSelect;
