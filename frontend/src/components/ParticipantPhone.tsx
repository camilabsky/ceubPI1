import { Phone } from 'lucide-react';

export default function ParticipantPhone({ telefone }: { telefone: string | null }) {
  if (!telefone) return <p className="mt-0.5 text-[10px] text-[#9aa39c]">Telefone não informado</p>;
  return (
    <a href={`tel:${telefone.replace(/[^\d+]/g, '')}`} className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#16803d] hover:underline">
      <Phone className="size-3" />{telefone}
    </a>
  );
}
