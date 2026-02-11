"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserItem {
  id: string;
  isEquipped: boolean;
  obtainedAt: string;
  item: {
    id: string;
    name: string;
    description: string;
    type: string;
    rarity: string;
    image: string;
    price: number;
    effects: string;
  };
}

export default function HeroPage() {
  const [inventory, setInventory] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquip = async (userItemId: string, currentlyEquipped: boolean) => {
    try {
      const response = await fetch('/api/inventory/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userItemId,
          equip: !currentlyEquipped
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const data = await response.json();
      fetchInventory();

    } catch (error) {
      console.error('Error equipping:', error);
      alert('Error al equipar el item');
    }
  };

  const getEquippedByType = (type: string) => {
    return inventory.find(ui => ui.isEquipped && ui.item.type === type);
  };

  const getEquippedBuffs = () => {
    return inventory.filter(ui => ui.isEquipped && ['BUFF', 'POTION', 'RUNE'].includes(ui.item.type));
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "from-yellow-500 via-orange-500 to-red-500";
      case "RARE": return "from-purple-500 via-pink-500 to-purple-600";
      case "COMMON": return "from-blue-500 via-cyan-500 to-blue-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  const weapon = getEquippedByType('WEAPON');
  const shield = getEquippedByType('SHIELD');
  const mount = getEquippedByType('MOUNT');
  const artifact = getEquippedByType('ARTIFACT');
  const buffs = getEquippedBuffs();
  const equippedSkins = inventory.filter(ui => ui.isEquipped && ui.item.type === 'SKIN');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin" />
          <p className="text-purple-400 font-mono text-sm animate-pulse tracking-widest uppercase">
            Cargando Héroe...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 relative overflow-hidden">
      
      {/* Fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
              <span className="text-3xl">👤</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 drop-shadow-2xl">
                  MI HÉROE
                </span>
              </h1>
              <p className="text-slate-400 text-sm font-bold mt-1">
                Equipamiento y poderes activos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar central */}
          <div className="lg:col-span-1">
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl">
              
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl border-4 border-purple-400/30">
                  <span className="text-8xl">🎮</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="bg-black/20 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Nivel</p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {stats?.level || 1}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 border border-white/10 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">XP</p>
                    <p className="text-lg font-black text-blue-400">{stats?.xp || 0}</p>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Monedas</p>
                    <p className="text-lg font-black text-yellow-400">{stats?.coins || 0}</p>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-green-400 uppercase font-bold tracking-widest mb-1">Items Equipados</p>
                  <p className="text-3xl font-black text-green-400">{stats?.equipped || 0}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  href="/shop"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black uppercase text-xs tracking-wider py-3 rounded-xl shadow-xl transition-all hover:scale-105 text-center"
                >
                  🏪 Tienda
                </Link>
                <Link
                  href="/inventory"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-xs tracking-wider py-3 rounded-xl shadow-xl transition-all hover:scale-105 text-center"
                >
                  🎒 Arsenal
                </Link>
              </div>
            </div>
          </div>

          {/* Slots de equipamiento */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Arma */}
            <EquipmentSlot
              title="⚔️ Arma Principal"
              item={weapon}
              emptyText="Sin arma equipada"
              onUnequip={weapon ? () => handleEquip(weapon.id, true) : undefined}
            />

            {/* Escudo */}
            <EquipmentSlot
              title="🛡️ Defensa"
              item={shield}
              emptyText="Sin escudo equipado"
              onUnequip={shield ? () => handleEquip(shield.id, true) : undefined}
            />

            {/* Buffs (2 slots) */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-blue-500/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-black uppercase text-blue-400 mb-4 flex items-center gap-2">
                <span>⚡</span> Buffs Activos (Máximo 2)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((index) => {
                  const buff = buffs[index];
                  return buff ? (
                    <div key={index} className="bg-black/20 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {buff.item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-white truncate">{buff.item.name}</h4>
                          <p className="text-[10px] text-blue-400 uppercase font-bold">{buff.item.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEquip(buff.id, true)}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black uppercase text-[10px] tracking-wider py-2 rounded-lg transition-all"
                      >
                        Desequipar
                      </button>
                    </div>
                  ) : (
                    <div key={index} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[120px]">
                      <p className="text-slate-600 text-xs italic">Slot vacío</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Montura */}
            <EquipmentSlot
              title="🐥 Montura"
              item={mount}
              emptyText="Sin montura equipada"
              onUnequip={mount ? () => handleEquip(mount.id, true) : undefined}
            />

            {/* Artefacto */}
            <EquipmentSlot
              title="👑 Artefacto"
              item={artifact}
              emptyText="Sin artefacto equipado"
              onUnequip={artifact ? () => handleEquip(artifact.id, true) : undefined}
            />

            {/* Skins activas */}
            {equippedSkins.length > 0 && (
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-pink-500/30 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-lg font-black uppercase text-pink-400 mb-4 flex items-center gap-2">
                  <span>✨</span> Skins Activas ({equippedSkins.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {equippedSkins.map((skin) => (
                    <div key={skin.id} className="bg-black/20 border border-pink-500/30 rounded-xl p-3 text-center">
                      <div className="text-3xl mb-2">{skin.item.image}</div>
                      <p className="text-[10px] font-bold text-white truncate">{skin.item.name}</p>
                      <button
                        onClick={() => handleEquip(skin.id, true)}
                        className="mt-2 w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black uppercase text-[9px] py-1.5 rounded-lg transition-all"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para slots de equipamiento
function EquipmentSlot({ title, item, emptyText, onUnequip }: any) {
  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "from-yellow-500 via-orange-500 to-red-500";
      case "RARE": return "from-purple-500 via-pink-500 to-purple-600";
      case "COMMON": return "from-blue-500 via-cyan-500 to-blue-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 border-white/10 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-lg font-black uppercase text-slate-300 mb-4">{title}</h3>
      
      {item ? (
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getRarityGradient(item.item.rarity)} p-1 shadow-2xl flex-shrink-0`}>
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <span className="text-4xl">{item.item.image}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${getRarityGradient(item.item.rarity)} truncate`}>
              {item.item.name}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2">{item.item.description}</p>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-1 rounded-lg text-[9px] font-bold bg-gradient-to-r ${getRarityGradient(item.item.rarity)} text-white`}>
                {item.item.rarity}
              </span>
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-[9px] font-bold text-green-300">
                ⚡ Activo
              </span>
            </div>
          </div>

          <button
            onClick={onUnequip}
            className="flex-shrink-0 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black uppercase text-[10px] tracking-wider px-4 py-2.5 rounded-xl transition-all hover:scale-105"
          >
            Desequipar
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
          <p className="text-slate-600 text-sm italic">{emptyText}</p>
        </div>
      )}
    </div>
  );
}