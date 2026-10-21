import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  onExplore: () => void;
  onHome: () => void;
}

export default function HomeGardensSection({ onExplore, onHome }: Props) {
  const { activeGarden, activeGardenId, availableGardens, selectGarden, leaveGarden } = useAuth();
  const [gardenToLeave, setGardenToLeave] = useState<{ id: number; nome: string; admin: boolean } | null>(null);
  const [leaving, setLeaving] = useState(false);

  const confirmLeave = async () => {
    if (!gardenToLeave || leaving) return;
    setLeaving(true);
    try {
      const updatedUser = await leaveGarden(gardenToLeave.id);
      toast.success(`Você saiu de ${gardenToLeave.nome}.`);
      setGardenToLeave(null);
      if (updatedUser.roles.length === 0) onExplore();
      else onHome();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível sair da horta.');
    } finally {
      setLeaving(false);
    }
  };

  return <>
    <section aria-labelledby="my-gardens-title" className="rounded-xl border border-[#dcebdd] bg-white p-4 sm:p-5">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div><h2 id="my-gardens-title" className="text-[16px] font-bold text-[#202b22]">Minhas hortas</h2><p className="mt-0.5 text-[11px] text-[#738076]">Selecione a horta e a função para abrir o painel correspondente.</p></div>
      {availableGardens.length > 0 && <span className="text-[11px] text-[#77837a]">{availableGardens.length} {availableGardens.length === 1 ? 'horta' : 'hortas'}</span>}
    </div>
    {availableGardens.length === 0
      ? <div className="rounded-lg border border-dashed border-[#dce5dc] bg-[#fbfdfb] px-4 py-5 text-center"><p className="text-[13px] font-semibold text-[#34453a]">Você ainda não participa de uma horta</p><p className="mt-1 text-[11px] text-[#77837a]">Explore as comunidades para encontrar uma horta para você.</p><button onClick={onExplore} className="mt-3 rounded-lg bg-[#168a3c] px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-[#117331]">Explorar hortas</button></div>
      : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{availableGardens.map((garden) => <article key={garden.id} className={`rounded-lg border p-3.5 ${garden.id === activeGardenId ? 'border-[#9dcda7] bg-[#f7fcf7]' : 'border-[#e7ece7] bg-white'}`}><div className="mb-3 flex items-start justify-between gap-2"><h3 className="min-w-0 truncate text-[13px] font-semibold text-[#26362a]">{garden.nome}</h3>{garden.id === activeGardenId && <span className="shrink-0 rounded-full bg-[#eaf7ed] px-2 py-0.5 text-[9px] font-semibold text-[#16803d]">Ativa</span>}</div><div className="flex flex-wrap items-center gap-2">{garden.roles.map((role) => { const selected = garden.id === activeGardenId && activeGarden?.role === role; return <button key={role} type="button" aria-pressed={selected} onClick={() => { selectGarden(garden.id, role); onHome(); }} className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition ${selected ? 'bg-[#168a3c] text-white' : 'border border-[#dfe8df] bg-white text-[#526056] hover:border-[#9dcda7] hover:text-[#16803d]'}`}>{role === 'ADMIN' ? 'Administrador' : 'Membro'}</button>; })}{garden.roles.includes('MEMBER') && <button type="button" onClick={() => setGardenToLeave({ id: garden.id, nome: garden.nome, admin: garden.roles.includes('ADMIN') })} className="ml-auto text-[10px] font-medium text-[#9b3d34] hover:underline">Sair da horta</button>}</div></article>)}</div>}
    </section>
    {gardenToLeave && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" role="presentation" onClick={() => !leaving && setGardenToLeave(null)}><section role="alertdialog" aria-modal="true" aria-labelledby="home-leave-garden-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h2 id="home-leave-garden-title" className="text-[16px] font-bold text-neutral-950">Sair de {gardenToLeave.nome}?</h2><p className="mt-2 text-[13px] leading-5 text-[#58665c]">Tarefas em andamento e registros históricos serão preservados, mas você perderá acesso como participante até voltar. {gardenToLeave.admin ? 'Sua função de administrador nesta horta permanecerá ativa. ' : ''}Sua conta e suas outras hortas não serão afetadas.</p><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={leaving} onClick={() => setGardenToLeave(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-[12px] font-semibold text-[#66736a]">Cancelar</button><button type="button" disabled={leaving} onClick={() => void confirmLeave()} className="rounded-lg bg-[#a83f36] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60">{leaving ? 'Saindo…' : 'Confirmar saída'}</button></div></section></div>}
  </>;
}
