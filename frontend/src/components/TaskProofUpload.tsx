import { useEffect, useRef, useState } from 'react';
import { Camera, Eye, ImagePlus, LoaderCircle, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface TaskProofUploadProps {
  taskId: number;
  hasPhoto: boolean;
  onUploaded: () => void;
  canRetry?: boolean;
  rejectionReason?: string | null;
}

interface ProofDraft {
  blob: Blob;
  previewUrl: string;
  mimeType: string;
}

interface LocationValidation {
  status: 'validated' | 'outside_radius' | 'unavailable' | 'garden_location_missing' | 'not_requested';
  distance_meters: number | null;
  latitude?: number | null;
  longitude?: number | null;
  ai_status?: 'not_requested' | 'analyzed' | 'unavailable';
  ai_resultado?: 'COMPATIVEL' | 'INCONCLUSIVO' | 'INCOMPATIVEL' | null;
  ai_confianca?: number | string | null;
  ai_justificativa?: string | null;
  ai_modelo?: string | null;
  auto_approved?: boolean;
  review_status?: string;
  review_note?: string | null;
}

const MAX_PROOF_BYTES = 450 * 1024;

function canvasBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

async function compressProofPhoto(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('Selecione um arquivo de imagem.');
  if (file.size > 20 * 1024 * 1024) throw new Error('A foto original deve ter no máximo 20 MB.');

  const bitmap = await createImageBitmap(file);
  try {
    const baseScale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const dimensions = [1, 0.9, 0.8, 0.7, 0.6];
    const qualities = [0.82, 0.74, 0.66, 0.58];
    let bestBlob: Blob | null = null;

    for (const mimeType of ['image/webp', 'image/jpeg']) {
      for (const dimensionScale of dimensions) {
        const scale = baseScale * dimensionScale;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Não foi possível preparar a imagem.');
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        for (const quality of qualities) {
          const blob = await canvasBlob(canvas, mimeType, quality);
          if (!blob || blob.type !== mimeType) break;
          bestBlob = blob;
          if (blob.size <= MAX_PROOF_BYTES) return blob;
        }
      }
      if (bestBlob) break;
    }

    if (!bestBlob || bestBlob.size > 2 * 1024 * 1024) {
      throw new Error('Não foi possível reduzir a foto o suficiente. Tente outra imagem.');
    }
    return bestBlob;
  } finally {
    bitmap.close();
  }
}

export default function TaskProofUpload({ taskId, hasPhoto, onUploaded, canRetry = false, rejectionReason }: TaskProofUploadProps) {
  const { token } = useAuth();
  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<ProofDraft | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [locationValidation, setLocationValidation] = useState<LocationValidation | null>(null);
  const [isSelectingNewPhoto, setIsSelectingNewPhoto] = useState(false);

  const loadValidation = async () => {
    if (!token) return;
    const response = await fetch(`${API_URL}/minhas_tarefas/${taskId}/localizacao`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return;
    setLocationValidation(await response.json() as LocationValidation);
  };

  useEffect(() => {
    if ((!hasPhoto && !canRetry) || !token) return;
    let cancelled = false;
    fetch(`${API_URL}/minhas_tarefas/${taskId}/localizacao`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      if (!response.ok) return null;
      return await response.json() as LocationValidation;
    }).then((result) => {
      if (!cancelled && result) setLocationValidation(result);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [hasPhoto, canRetry, taskId, token]);

  useEffect(() => () => {
    if (draft) URL.revokeObjectURL(draft.previewUrl);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [draft?.previewUrl, photoUrl]);

  const selectPhoto = async (file?: File) => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const blob = await compressProofPhoto(file);
      const previewUrl = URL.createObjectURL(blob);
      setDraft((previous) => {
        if (previous) URL.revokeObjectURL(previous.previewUrl);
        return { blob, previewUrl, mimeType: blob.type };
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível preparar a foto.');
    } finally {
      setIsCompressing(false);
    }
  };

  const uploadProof = async () => {
    if (!token || !draft) return;
    setIsUploading(true);
    try {
      let coordinates: { latitude: number; longitude: number } | null = null;
      if (navigator.geolocation) {
        try {
          coordinates = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => navigator.geolocation.getCurrentPosition(
            (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            reject,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
          ));
        } catch {
          toast.info('Sem acesso à localização. A comprovação será enviada para análise.');
        }
      } else {
        toast.info('Este navegador não disponibilizou a localização. A comprovação será enviada para análise.');
      }
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        'Content-Type': draft.mimeType,
      };
      if (coordinates) {
        headers['X-User-Latitude'] = String(coordinates.latitude);
        headers['X-User-Longitude'] = String(coordinates.longitude);
      }
      const response = await fetch(`${API_URL}/tarefas/${taskId}/comprovacao`, {
        method: 'POST',
        headers,
        body: draft.blob,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar a foto.');
      URL.revokeObjectURL(draft.previewUrl);
      setDraft(null);
      setIsSelectingNewPhoto(false);
      await loadValidation().catch(() => {});
      const locationStatus = result.location_validation?.status;
      if (result.ai_analysis?.auto_approved) toast.success('Aprovada automaticamente pela IA · recompensas liberadas.');
      else if (result.ai_analysis?.status === 'analyzed') toast.success('Comprovação analisada por IA e enviada para análise do responsável.');
      else if (locationStatus === 'validated') toast.info('Comprovação enviada. A análise por IA está indisponível; ficará aguardando o responsável.');
      else toast.info('Comprovação enviada. A localização ou análise precisa ser verificada pelo responsável.');
      onUploaded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar comprovação.');
    } finally {
      setIsUploading(false);
    }
  };

  const showSubmittedPhoto = async () => {
    if (!hasPhoto) return;
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
      return;
    }
    if (!token) return;
    setIsLoadingPhoto(true);
    try {
      const response = await fetch(`${API_URL}/minhas_tarefas/${taskId}/comprovacao`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Não foi possível carregar a foto enviada.');
      setPhotoUrl(URL.createObjectURL(await response.blob()));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar a comprovação.');
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const resultText = locationValidation?.ai_status === 'analyzed'
    ? `${locationValidation.ai_resultado || 'Resultado indisponível'}${locationValidation.ai_confianca != null ? ` · ${Math.round(Number(locationValidation.ai_confianca) * 100)}% de confiança` : ''}`
    : locationValidation?.ai_status === 'unavailable' ? 'Análise indisponível' : 'Aguardando análise';
  const locationText = locationValidation?.status === 'validated'
    ? `Válida · ${locationValidation.distance_meters ?? '—'} m da horta · limite de 100 m`
    : locationValidation?.status === 'outside_radius'
      ? `Fora do limite · ${locationValidation.distance_meters ?? '—'} m da horta · limite de 100 m`
      : locationValidation?.status === 'garden_location_missing' ? 'Coordenadas da horta indisponíveis'
        : 'Não validada ou indisponível';
  const proofStatus = rejectionReason || locationValidation?.review_status === 'rejected'
    ? 'Reprovada pelo responsável'
    : locationValidation?.auto_approved ? 'Aprovada automaticamente pela IA'
      : locationValidation?.review_status === 'approved' ? 'Aprovada pelo responsável'
        : hasPhoto ? 'Aguardando análise do responsável' : 'Aguardando comprovação';
  const visibleRejectionReason = rejectionReason || locationValidation?.review_note || null;
  const showPhotoPicker = (!hasPhoto && !canRetry) || (canRetry && isSelectingNewPhoto);

  return <div className="mt-2 rounded-lg border border-[#e6ece6] bg-[#fbfdfb] p-2.5">
    <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => { void selectPhoto(event.target.files?.[0]); event.target.value = ''; }} />
    <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => { void selectPhoto(event.target.files?.[0]); event.target.value = ''; }} />
    {(hasPhoto || canRetry) && <>
      <h3 className="text-[11px] font-semibold text-[#34453a]">Validação da comprovação</h3>
      <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 10.5rem), 1fr))' }}>
        <div className="min-w-0 rounded-md border border-gray-100 bg-white px-2.5 py-2"><p className="text-[9px] font-medium text-[#718075]">Foto</p><div className="mt-0.5 flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1"><span className="text-[10px] font-semibold text-[#34453a]">{hasPhoto ? 'Enviada' : canRetry ? 'Aguardando nova foto' : 'Não enviada'}</span>{hasPhoto && <button type="button" onClick={showSubmittedPhoto} disabled={isLoadingPhoto} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[9px] font-semibold text-[#16803d] hover:underline disabled:opacity-60">{isLoadingPhoto ? <LoaderCircle className="size-3 animate-spin" /> : <Eye className="size-3" />}{photoUrl ? 'Ocultar' : 'Ver foto'}</button>}</div></div>
        <div className="min-w-0 rounded-md border border-gray-100 bg-white px-2.5 py-2"><p className="text-[9px] font-medium text-[#718075]">Localização</p><p className="mt-0.5 break-words text-[10px] font-semibold text-[#34453a]">{locationText}</p></div>
        <div className="min-w-0 rounded-md border border-gray-100 bg-white px-2.5 py-2"><p className="text-[9px] font-medium text-[#718075]">Análise por IA</p><p className="mt-0.5 break-words text-[10px] font-semibold text-[#34453a]">{resultText}</p>{locationValidation?.ai_justificativa && <p className="mt-0.5 line-clamp-2 break-words text-[9px] text-[#718075]">{locationValidation.ai_justificativa}</p>}</div>
        <div className="min-w-0 rounded-md border border-gray-100 bg-white px-2.5 py-2"><p className="text-[9px] font-medium text-[#718075]">Status</p><p className={`mt-0.5 break-words text-[10px] font-semibold ${rejectionReason || locationValidation?.review_status === 'rejected' ? 'text-red-700' : locationValidation?.auto_approved || locationValidation?.review_status === 'approved' ? 'text-[#16803d]' : 'text-amber-800'}`}>{proofStatus}</p></div>
      </div>
      {visibleRejectionReason && <div className="mt-2 rounded-md border border-red-100 bg-red-50/70 px-2.5 py-2"><p className="text-[9px] font-semibold text-red-800">Motivo da reprovação</p><p className="mt-0.5 break-words text-[10px] leading-relaxed text-red-800">{visibleRejectionReason}</p></div>}
      {photoUrl && hasPhoto && <div className="mt-2 flex max-h-[70vh] w-full justify-center overflow-hidden rounded-md bg-white p-2"><img src={photoUrl} alt="Foto enviada como comprovação da tarefa" className="block h-auto max-h-[calc(70vh-1rem)] max-w-full object-contain" /></div>}
    </>}
    {canRetry && !isSelectingNewPhoto && <button type="button" onClick={() => setIsSelectingNewPhoto(true)} className="mt-2 rounded-lg bg-[#168a3c] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#117331]">Enviar nova comprovação</button>}
    {showPhotoPicker && <div className={`${hasPhoto || canRetry ? 'mt-2 border-t border-gray-100 pt-2' : ''}`}>
      {draft ? <>
        <div className="relative"><img src={draft.previewUrl} alt="Prévia da foto de comprovação" className="max-h-56 w-full rounded-md bg-white object-contain" /><button type="button" aria-label="Remover foto selecionada" onClick={() => { URL.revokeObjectURL(draft.previewUrl); setDraft(null); }} className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-white/95 text-[#4f5d52] shadow"><X className="size-4" /></button></div>
        <div className="mt-2 flex items-center justify-between gap-2"><span className="truncate text-[9px] text-[#718075]">Foto otimizada · {Math.max(1, Math.round(draft.blob.size / 1024))} KB · {draft.mimeType === 'image/webp' ? 'WebP' : 'JPEG'}</span><button type="button" disabled={isUploading} onClick={() => void uploadProof()} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#168a3c] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#117331] disabled:opacity-60">{isUploading ? <LoaderCircle className="size-3 animate-spin" /> : <Upload className="size-3" />}{canRetry ? 'Enviar nova comprovação' : 'Enviar comprovação'}</button></div>
      </> : <>
        <p className="text-[10px] font-medium text-[#526056]">{canRetry ? 'Envie uma nova foto. A localização será solicitada novamente e a comprovação passará por nova análise.' : 'Adicione uma foto da tarefa para comprovar sua realização.'}</p>
        <div className="mt-2 flex flex-wrap gap-2"><button type="button" disabled={isCompressing} onClick={() => cameraInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dce5dc] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#34453a] disabled:opacity-60"><Camera className="size-3.5" />Tirar foto</button><button type="button" disabled={isCompressing} onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dce5dc] bg-white px-2.5 py-2 text-[10px] font-semibold text-[#34453a] disabled:opacity-60"><ImagePlus className="size-3.5" />Selecionar foto</button>{isCompressing && <span className="inline-flex items-center gap-1.5 text-[10px] text-[#718075]"><LoaderCircle className="size-3 animate-spin" />Otimizando foto…</span>}{canRetry && <button type="button" onClick={() => { setIsSelectingNewPhoto(false); setDraft(null); }} className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[10px] font-semibold text-[#526056]">Cancelar</button>}</div>
      </>}
    </div>}
  </div>;
}
