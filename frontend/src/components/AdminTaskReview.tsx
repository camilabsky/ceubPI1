import { useEffect, useState } from 'react';
import { Eye, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface AdminTaskReviewProps {
  taskId: number;
  onReviewed: () => void;
  readOnly?: boolean;
}

interface ProofReviewDetails {
  status: string;
  distance_meters: number | null;
  ai_status: 'not_requested' | 'analyzed' | 'unavailable';
  ai_resultado: 'COMPATIVEL' | 'INCONCLUSIVO' | 'INCOMPATIVEL' | null;
  ai_confianca: number | string | null;
  ai_justificativa: string | null;
  ai_modelo: string | null;
  ai_analisado_em: string | null;
  auto_approved?: boolean;
  review_status?: string;
}

export default function AdminTaskReview({ taskId, onReviewed, readOnly = false }: AdminTaskReviewProps) {
  const { token } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [details, setDetails] = useState<ProofReviewDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsLoadingDetails(true);
    fetch(`${API_URL}/admin/tarefas/${taskId}/localizacao`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar a análise.');
      if (!cancelled) setDetails(result as ProofReviewDetails);
    }).catch((error) => {
      if (!cancelled) toast.error(error instanceof Error ? error.message : 'Erro ao carregar análise.');
    }).finally(() => {
      if (!cancelled) setIsLoadingDetails(false);
    });
    return () => { cancelled = true; };
  }, [taskId, token]);

  const togglePhoto = async () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
      return;
    }
    if (!token) return;
    setIsLoadingPhoto(true);
    try {
      const response = await fetch(`${API_URL}/admin/tarefas/${taskId}/comprovacao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Não foi possível carregar a foto.');
      }
      setPhotoUrl(URL.createObjectURL(await response.blob()));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar a foto.');
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const review = async (decision: 'aprovar' | 'reprovar') => {
    if (!token) return;
    if (decision === 'reprovar' && !reason.trim()) {
      toast.error('Informe o motivo da reprovação.');
      return;
    }
    setIsReviewing(true);
    try {
      const response = await fetch(`${API_URL}/admin/tarefas/${taskId}/${decision}-comprovacao`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: decision === 'reprovar' ? JSON.stringify({ motivo: reason }) : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível analisar a comprovação.');
      toast.success(decision === 'aprovar' ? `Comprovação aprovada · +${result.xp} XP · +${result.moedas} moedas` : 'Comprovação recusada. O participante poderá tentar novamente.');
      onReviewed();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao analisar a comprovação.');
    } finally {
      setIsReviewing(false);
    }
  };

  return <div className="mt-2 rounded-lg border border-[#e6ece6] bg-[#fbfdfb] p-2.5">
    <div className="rounded-lg border border-[#e2ebe2] bg-white p-2.5">
      <p className="text-[11px] font-semibold text-[#26352a]">Análise por IA</p>
      {isLoadingDetails ? <p className="mt-1 text-[10px] text-[#718075]">Carregando resultado…</p> : details?.ai_status === 'analyzed' ? <>
        <p className="mt-1 text-[10px] text-[#46534a]">Resultado: <strong>{details.ai_resultado}</strong> · Confiança: <strong>{Math.round(Number(details.ai_confianca) * 100)}%</strong></p>
        <p className="mt-1 text-[10px] leading-relaxed text-[#66736a]">{details.ai_justificativa}</p>
        <p className={`mt-1 text-[10px] font-semibold ${details.auto_approved ? 'text-[#16803d]' : 'text-amber-800'}`}>{details.auto_approved ? 'Aprovada automaticamente pela IA' : readOnly ? 'Aprovada pelo responsável' : 'Análise manual necessária'}</p>
      </> : <>
        <p className="mt-1 text-[10px] text-[#66736a]">{details?.ai_status === 'unavailable' ? (readOnly ? 'A IA não conseguiu analisar; a comprovação foi revisada pelo responsável.' : 'Análise indisponível. A comprovação continua aguardando o responsável.') : 'Ainda não há resultado de IA disponível.'}</p>
        <p className="mt-1 text-[10px] font-semibold text-amber-800">{readOnly ? 'Aprovada pelo responsável' : 'Análise manual necessária'}</p>
      </>}
      <p className="mt-2 border-t border-gray-100 pt-1.5 text-[10px] text-[#59665d]">GPS: {details?.status === 'validated' ? `Validado${details.distance_meters != null ? ` · ${details.distance_meters} m da horta` : ''}` : details?.status === 'outside_radius' ? `Fora do raio${details.distance_meters != null ? ` · ${details.distance_meters} m da horta` : ''}` : details?.status === 'garden_location_missing' ? 'Horta sem coordenadas cadastradas' : 'Indisponível ou não validado'}</p>
    </div>
    <button type="button" onClick={() => void togglePhoto()} disabled={isLoadingPhoto || isReviewing} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#16803d] underline disabled:opacity-60">
      {isLoadingPhoto ? <LoaderCircle className="size-3 animate-spin" /> : <Eye className="size-3" />}
      {photoUrl ? 'Ocultar foto enviada' : 'Visualizar foto enviada'}
    </button>
    {photoUrl && <img src={photoUrl} alt="Foto de comprovação enviada pelo participante" className="mt-2 max-h-64 w-full rounded-md bg-white object-contain" />}
    <div className="mt-2 space-y-2">
      {!readOnly && <textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={512} rows={2} placeholder="Motivo obrigatório se reprovar" aria-label="Motivo da reprovação" className="w-full resize-y rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[11px] outline-none focus:border-[#00a63e]" />}
      {!readOnly && <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void review('aprovar')} disabled={isReviewing} className="rounded-lg bg-[#168a3c] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#117331] disabled:opacity-60">{isReviewing ? 'Salvando…' : 'Aprovar comprovação'}</button>
        <button type="button" onClick={() => void review('reprovar')} disabled={isReviewing || !reason.trim()} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[10px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Reprovar</button>
      </div>}
    </div>
  </div>;
}
