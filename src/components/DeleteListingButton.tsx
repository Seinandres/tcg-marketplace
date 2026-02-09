// @ts-nocheck
"use client";

import { deleteListing } from "@/lib/actions";

export function DeleteListingButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmDelete = confirm("¿Estás seguro de retirar este producto de la bodega?");
    
    if (confirmDelete) {
      const result = await deleteListing(id);
      if (!result.success) {
        alert("Error: " + result.error);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-xs font-bold text-red-900 hover:text-red-500 transition-colors uppercase tracking-widest"
    >
      Retirar
    </button>
  );
}