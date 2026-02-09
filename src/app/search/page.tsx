import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Esta línea hace que la página sea dinámica (no caché) para buscar siempre fresco
export const dynamic = 'force-dynamic';

export default async function SearchPage(props: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;

  // Si no escribe nada, lo mandamos al inicio
  if (!query) {
    redirect("/");
  }

  // Buscamos en la base de datos (ignorando mayúsculas/minúsculas)
  const cards = await prisma.card.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive", // 👈 LA CLAVE MÁGICA
      },
    },
    include: {
      set: true, // Traemos info del Set (ej: 151)
    },
    take: 20, // Máximo 20 resultados para no saturar
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Resultados para: <span className="text-purple-400">"{query}"</span>
      </h1>

      {cards.length === 0 ? (
        <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-lg">No encontramos cartas con ese nombre.</p>
          <p className="text-sm text-gray-600 mt-2">Intenta con "Pikachu", "Mewtwo" o "Charizard".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/cards/${card.id}`}
              className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <div className="relative aspect-[2.5/3.5] bg-gray-800">
                <Image
                  src={card.imageUrlSmall}
                  alt={card.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-white truncate">{card.name}</h3>
                <p className="text-xs text-gray-500">{card.set.name}</p>
                {card.marketPrice && (
                  <p className="text-sm font-medium text-green-400 mt-1">
                    Ref: ${Math.round(card.marketPrice).toLocaleString("es-CL")} USD
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}