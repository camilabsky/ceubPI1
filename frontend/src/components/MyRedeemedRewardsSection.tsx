import { Gift } from 'lucide-react';

export interface RedeemedReward {
  id: number;
  nome: string;
  redeemed_at: string | null;
  redeemed_price: number | null;
}

function formatRedemptionDate(value: string | null) {
  if (!value) return 'Data não registrada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data não registrada';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MyRedeemedRewardsSection({ rewards, loading = false, error }: { rewards: RedeemedReward[]; loading?: boolean; error?: string | null }) {
  return <section className="mb-5 rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5">
    <div className="mb-4">
      <h2 className="text-[15px] font-semibold text-neutral-950">Minhas recompensas</h2>
      <p className="mt-0.5 text-[12px] text-[#718075]">Seu histórico de recompensas resgatadas nas hortas.</p>
    </div>
    {loading ? <p className="py-5 text-center text-[13px] text-[#718075]">Carregando seus resgates...</p>
      : error ? <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-center text-[13px] text-[#805c16]">{error}</p>
      : rewards.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center">
        <Gift className="mx-auto size-6 text-[#7caa86]" />
        <p className="mt-2 text-[13px] font-semibold text-[#34453a]">Nenhuma recompensa resgatada ainda</p>
        <p className="mt-1 text-[12px] text-[#718075]">Quando você resgatar uma recompensa, ela aparecerá aqui.</p>
      </div> : <div className="divide-y divide-gray-100">
        {rewards.map((reward, index) => <article key={`${reward.id}-${reward.redeemed_at ?? 'unknown'}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[#ad7817]"><Gift className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-neutral-950">{reward.nome || 'Recompensa indisponível'}</p>
              <p className="mt-0.5 text-[11px] text-[#718075]">Resgatada em {formatRedemptionDate(reward.redeemed_at)}</p>
            </div>
          </div>
          <span className="shrink-0 text-[12px] font-semibold text-[#8a6514]">{reward.redeemed_price == null ? 'Custo não registrado' : `${Number(reward.redeemed_price)} moedas`}</span>
        </article>)}
      </div>}
  </section>;
}
