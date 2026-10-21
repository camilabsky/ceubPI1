import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';
import { HortaMap } from './HortaMap';

export interface HortaDraft {
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  uf: string;
  contato: string;
  lat: string;
  lng: string;
}

export const HORTA_VAZIA: HortaDraft = { nome: '', descricao: '', endereco: '', cidade: '', uf: '', contato: '', lat: '', lng: '' };

const UFS = new Set(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']);

export function validarHorta(d: HortaDraft, exigirDadosCompletos = false): string | null {
  if (!d.nome.trim()) return 'Informe o nome da horta';
  if (exigirDadosCompletos && !d.descricao.trim()) return 'Informe a descrição e os objetivos da horta';
  if (!d.endereco.trim()) return 'Informe o endereço da horta';
  if (exigirDadosCompletos && !d.cidade.trim()) return 'Informe a cidade da horta';
  if (exigirDadosCompletos && !UFS.has(d.uf.trim().toUpperCase())) return 'Informe uma UF brasileira válida';
  if (exigirDadosCompletos && !d.contato.trim()) return 'Informe um telefone ou e-mail de contato da horta';
  if (exigirDadosCompletos && d.contato.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contato.trim()) && !/^\+?[0-9 ()-]{8,20}$/.test(d.contato.trim())) return 'Informe um telefone ou e-mail válido para o contato da horta';
  if (d.nome.trim().length > 128 || d.endereco.trim().length > 255 || d.descricao.trim().length > 255 || d.cidade.trim().length > 100 || d.contato.trim().length > 160) return 'Um dos campos da horta excede o limite permitido';
  const temLatitude = Boolean(d.lat.trim());
  const temLongitude = Boolean(d.lng.trim());
  if (!temLatitude && !temLongitude) return null;
  if (!temLatitude || !temLongitude) return 'Informe latitude e longitude juntas ou deixe ambas vazias';
  const la = Number(d.lat);
  const lo = Number(d.lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) {
    return 'Informe coordenadas válidas para a localização';
  }
  return null;
}

export function payloadHorta(d: HortaDraft) {
  return {
    nome: d.nome.trim(),
    descricao: d.descricao.trim() || undefined,
    endereco: d.endereco.trim(),
    cidade: d.cidade.trim(),
    uf: d.uf.trim().toUpperCase(),
    contato: d.contato.trim(),
    latitude: d.lat.trim() ? Number(d.lat) : null,
    longitude: d.lng.trim() ? Number(d.lng) : null,
  };
}

const inputCls =
  'w-full rounded-lg border border-[#E2E8E3] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#16A34A]';

interface Props {
  value: HortaDraft;
  onChange: (d: HortaDraft) => void;
  mostrarDescricao?: boolean;
  permitirEnderecoSemCoordenadas?: boolean;
}

export default function HortaFields({ value, onChange, mostrarDescricao = false, permitirEnderecoSemCoordenadas = false }: Props) {
  const [locating, setLocating] = useState(false);
  const set = (parcial: Partial<HortaDraft>) => onChange({ ...value, ...parcial });

  const usarLocalizacao = () => {
    if (!navigator.geolocation) {
      toast.error('Seu navegador não suporta geolocalização');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const la = pos.coords.latitude;
        const lo = pos.coords.longitude;
        let endereco = value.endereco;
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${la}&lon=${lo}&accept-language=pt-BR`
          );
          const j = await r.json();
          if (j?.display_name) endereco = String(j.display_name).slice(0, 255);
        } catch {
          toast.info('Localização obtida, mas não consegui buscar o endereço. Preencha manualmente.');
        }
        set({ lat: la.toFixed(6), lng: lo.toFixed(6), endereco });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.error('Não foi possível obter sua localização. Preencha manualmente.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-[13px] text-[#4a5565]">Nome da horta *</label>
        <input className={inputCls} maxLength={128} value={value.nome} onChange={(e) => set({ nome: e.target.value })} />
      </div>

         {mostrarDescricao && (
      <div>
        <label className="mb-1 block text-[13px] text-[#4a5565]">Descrição e objetivos *</label>
        <textarea
          className={inputCls}
          rows={2}
          maxLength={255}
          value={value.descricao}
          onChange={(e) => set({ descricao: e.target.value })}
        />
      </div>
         )}

      <div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2"><label className="mb-1 block text-[13px] text-[#4a5565]">Cidade *</label><input className={inputCls} maxLength={100} value={value.cidade} onChange={(e) => set({ cidade: e.target.value })} placeholder="Cidade" /></div>
          <div><label className="mb-1 block text-[13px] text-[#4a5565]">UF *</label><input className={inputCls} maxLength={2} value={value.uf} onChange={(e) => set({ uf: e.target.value.toUpperCase() })} placeholder="UF" /></div>
        </div>
      </div>

      {mostrarDescricao && <div><label className="mb-1 block text-[13px] text-[#4a5565]">Contato da horta (telefone ou e-mail) *</label><input className={inputCls} maxLength={160} value={value.contato} onChange={(e) => set({ contato: e.target.value })} placeholder="(61) 99999-9999 ou contato@horta.org" /></div>}

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-[13px] text-[#4a5565]">Endereço ou localização *</label>
          <button
            type="button"
            onClick={usarLocalizacao}
            disabled={locating}
            className="flex items-center gap-1 text-[13px] font-medium text-[#16A34A] hover:text-[#166534] disabled:opacity-60"
          >
            {locating ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
            Usar minha localização atual
          </button>
        </div>
        <input
          className={inputCls}
          placeholder="Endereço"
          maxLength={255}
          value={value.endereco}
          onChange={(e) => set({ endereco: e.target.value })}
        />
        <p className="mt-2 text-[11px] text-[#718075]">O endereço pode ser cadastrado sem coordenadas. O GPS é opcional; as coordenadas permitem exibir a horta no mapa.</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input className={inputCls} placeholder="Latitude" inputMode="decimal" value={value.lat} onChange={(e) => set({ lat: e.target.value })} />
          <input className={inputCls} placeholder="Longitude" inputMode="decimal" value={value.lng} onChange={(e) => set({ lng: e.target.value })} />
        </div>
      </div>

      <HortaMap
        latitude={value.lat.trim() ? value.lat : null}
        longitude={value.lng.trim() ? value.lng : null}
        nome={value.nome || 'Sua horta'}
        endereco={value.endereco}
        height="200px"
      />
    </div>
  );
}
