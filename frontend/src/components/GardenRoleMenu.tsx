import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Sprout, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function GardenRoleMenu() {
  const { activeGarden, activeGardenId, availableGardens, selectGarden } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  if (availableGardens.length === 0) return null;

  const activeLabel = activeGarden
    ? `${activeGarden.role === 'ADMIN' ? 'Administrador' : 'Membro'} em ${activeGarden.horta_nome}`
    : 'Escolher horta e função';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={`Abrir menu de horta e função. Ativo: ${activeLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex size-10 items-center justify-center rounded-full bg-[#00a63e] transition hover:bg-[#008236] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008236] focus-visible:ring-offset-2"
      >
        <UserRound className="size-4 text-white" />
      </button>

      {open && <div role="menu" aria-label="Selecionar horta e função" className="absolute right-0 top-full z-[1200] mt-2 max-h-[min(70vh,24rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
        <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-[#718075]">Hortas e painéis</p>
        {availableGardens.map((garden) => (
          <section key={garden.id} role="group" aria-label={garden.nome} className="border-t border-gray-100 py-2 first:border-0 first:pt-0">
            <p className="truncate px-2 pb-1 text-[12px] font-semibold text-[#26362a]">{garden.nome}</p>
            {garden.roles.map((role) => {
              const selected = garden.id === activeGardenId && activeGarden?.role === role;
              const RoleIcon = role === 'ADMIN' ? ShieldCheck : Sprout;
              return <button
                key={role}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  selectGarden(garden.id, role);
                  setOpen(false);
                }}
                className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 text-left text-[12px] transition ${selected ? 'bg-[#eaf7ed] font-semibold text-[#16803d]' : 'text-[#526056] hover:bg-gray-50'}`}
              >
                <RoleIcon className="size-4 shrink-0" />
                <span className="flex-1">Painel {role === 'ADMIN' ? 'ADMIN' : 'MEMBER'}</span>
                {selected && <span className="text-[10px] font-medium">Ativo</span>}
              </button>;
            })}
          </section>
        ))}
      </div>}
    </div>
  );
}
