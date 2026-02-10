"use client";

import { deleteListing } from "@/lib/actions";

interface Props {
  id: string;
  onSuccess: () => void; // 👈 Función para refrescar la lista
}

export function DeleteListingButton({ id, onSuccess }: Props) {
  const handleDelete = async () => {
    if (confirm("¿Estás seguro de retirar este producto de la bodega?")) {
      const result = await deleteListing(id);
      if (result.success) {
        onSuccess(); // 👈 Esto hace que la carta desaparezca de la vista al instante
      } else {
        alert("Error al retirar: " + result.error);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-[10px] font-black text-red-900 hover:text-red-500 transition-colors uppercase tracking-widest"
    >
      RETIRAR
    </button>
  );
}