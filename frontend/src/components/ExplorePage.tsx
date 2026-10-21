import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Check, Compass, ExternalLink, Leaf, LoaderCircle, MapPin, MapPinned, Search, Sprout, Users, X, Mail, Phone, ShieldCheck, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

type Horta = {
  id: number;
  nome: string;
  descricao: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  endereco: string | null;
  cidade: string | null;
  uf: string | null;
  contato: string | null;
  participantes: number | string;
};

type DetalhesHorta = Horta & {
  responsaveis: string[];
  atividades_disponiveis: number | string;
};

type Filtro = 'Todas' | 'Mais próximas' | 'Mais ativas' | 'Novas hortas';
type Position = { lat: number; lng: number };

const filtros: Filtro[] = ['Todas', 'Mais próximas', 'Mais ativas', 'Novas hortas'];
const fotos = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=420&q=85',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=420&q=85',
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=420&q=85',
];

const markerIcon = (selected = false) => L.divIcon({
  className: 'horta-map-marker',
  html: `<span style="display:flex;width:${selected ? 38 : 32}px;height:${selected ? 38 : 32}px;align-items:center;justify-content:center;border:3px solid white;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${selected ? '#008236' : '#16a34a'};box-shadow:0 3px 10px #163d2a55"><span style="transform:rotate(45deg);color:white;font-size:${selected ? 17 : 14}px">✿</span></span>`,
  iconSize: selected ? [38, 38] : [32, 32],
  iconAnchor: selected ? [19, 38] : [16, 32],
});

const coordinates = (horta: Horta): Position | null => {
  const lat = Number(horta.latitude);
  const lng = Number(horta.longitude);
  return horta.latitude != null && horta.longitude != null && Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    ? { lat, lng }
    : null;
};

function readSessionPosition(key: string): Position | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || 'null') as Position | null;
    return value && Number.isFinite(value.lat) && Number.isFinite(value.lng)
      && value.lat >= -90 && value.lat <= 90 && value.lng >= -180 && value.lng <= 180
      ? value
      : null;
  } catch {
    return null;
  }
}

const stateNames: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
  ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

function distanceKm(a: Position, b: Position) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const q = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

function MapBounds({ hortas, selectedId }: { hortas: Horta[]; selectedId: number | null }) {
  const map = useMap();
  useEffect(() => {
    const selected = hortas.find((horta) => horta.id === selectedId);
    const selectedCoords = selected && coordinates(selected);
    if (selectedCoords) {
      map.flyTo([selectedCoords.lat, selectedCoords.lng], Math.max(map.getZoom(), 14), { duration: 0.5 });
      return;
    }
    const points = hortas.map(coordinates).filter((point): point is Position => point !== null);
    if (points.length > 1) map.fitBounds(points.map((point) => [point.lat, point.lng] as [number, number]), { padding: [36, 36], maxZoom: 14 });
    else if (points.length === 1) map.setView([points[0].lat, points[0].lng], 14);
  }, [hortas, map, selectedId]);
  return null;
}

export default function ExplorePage() {
  const { token, user, applyUser } = useAuth();
  const [hortas, setHortas] = useState<Horta[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('Todas');
  const [posicao, setPosicao] = useState<Position | null>(() => readSessionPosition('couve:user-position'));
  const [selecionada, setSelecionada] = useState<Horta | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhes, setDetalhes] = useState<DetalhesHorta | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [erroDetalhes, setErroDetalhes] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const [hortasRes, saldoRes] = await Promise.all([
          fetch(`${API_URL}/hortas`),
          fetch(`${API_URL}/minhas_moedas`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!hortasRes.ok) throw new Error('Não foi possível carregar as hortas.');
        const lista: Horta[] = await hortasRes.json();
        const saldoData = saldoRes.ok ? await saldoRes.json() : { Saldo: 0 };
        if (ativo) {
          setHortas(lista);
          setSaldo(Number(saldoData.Saldo) || 0);
          setSelecionada(lista[0] ?? null);
        }
      } catch (error) {
        if (ativo) toast.error(error instanceof Error ? error.message : 'Erro ao carregar hortas.');
      } finally {
        if (ativo) setCarregando(false);
      }
    };
    carregar();
    return () => { ativo = false; };
  }, [token]);

  useEffect(() => {
    if (!modalAberto || !selecionada) return;
    const controller = new AbortController();
    setDetalhes(null);
    setErroDetalhes('');
    setCarregandoDetalhes(true);
    fetch(`${API_URL}/hortas/${selecionada.id}/detalhes`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Não foi possível carregar os detalhes da horta.');
        return data as DetalhesHorta;
      })
      .then(setDetalhes)
      .catch((error) => { if (error.name !== 'AbortError') setErroDetalhes(error instanceof Error ? error.message : 'Não foi possível carregar os detalhes da horta.'); })
      .finally(() => { if (!controller.signal.aborted) setCarregandoDetalhes(false); });
    return () => controller.abort();
  }, [modalAberto, selecionada?.id]);

  useEffect(() => {
    let ativo = true;
    const carregarLocalizacaoPerfil = async () => {
      if (!token || posicao) return;
      try {
        const response = await fetch(`${API_URL}/me/localizacao`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) return;
        const { cidade, uf } = await response.json() as { cidade?: string; uf?: string };
        if (!cidade || !uf || !ativo) return;

        const cacheKey = `couve:profile-position:${cidade.trim().toLocaleLowerCase('pt-BR')}:${uf.toUpperCase()}`;
        const cached = readSessionPosition(cacheKey);
        if (cached) {
          setPosicao(cached);
          setFiltro('Mais próximas');
          return;
        }

        const query = `${cidade.trim()}, ${stateNames[uf.toUpperCase()] || uf.toUpperCase()}, Brazil`;
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(query)}`);
        if (!geocodeResponse.ok) return;
        const matches = await geocodeResponse.json() as Array<{ lat?: string; lon?: string }>;
        const lat = Number(matches[0]?.lat);
        const lng = Number(matches[0]?.lon);
        if (!ativo || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
        const approximatePosition = { lat, lng };
        try { sessionStorage.setItem(cacheKey, JSON.stringify(approximatePosition)); } catch { /* cache opcional */ }
        setPosicao(approximatePosition);
        setFiltro('Mais próximas');
      } catch {
        // A geocodificação é opcional: a exploração segue disponível sem ordenação por distância.
      }
    };
    void carregarLocalizacaoPerfil();
    return () => { ativo = false; };
  }, [token, posicao]);

  const listaVisivel = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    const encontrados = hortas.filter((horta) => `${horta.nome} ${horta.endereco ?? ''} ${horta.descricao ?? ''} ${horta.cidade ?? ''} ${horta.uf ?? ''} ${horta.contato ?? ''}`.toLocaleLowerCase('pt-BR').includes(termo));
    if (filtro === 'Mais ativas') return [...encontrados].sort((a, b) => Number(b.participantes) - Number(a.participantes));
    if (filtro === 'Novas hortas') return [...encontrados].sort((a, b) => b.id - a.id);
    if (filtro === 'Mais próximas' && posicao) {
      return [...encontrados].sort((a, b) => {
        const ca = coordinates(a); const cb = coordinates(b);
        return (ca ? distanceKm(posicao, ca) : Number.POSITIVE_INFINITY) - (cb ? distanceKm(posicao, cb) : Number.POSITIVE_INFINITY);
      });
    }
    return encontrados;
  }, [busca, filtro, hortas, posicao]);

  const usarLocalizacao = () => {
    if (!navigator.geolocation) return toast.error('Seu navegador não oferece localização.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const currentPosition = { lat: coords.latitude, lng: coords.longitude };
        try { sessionStorage.setItem('couve:user-position', JSON.stringify(currentPosition)); } catch { /* posição mantida em memória */ }
        setPosicao(currentPosition);
        setFiltro('Mais próximas');
      },
      () => toast.error('Não foi possível acessar sua localização. Confira a permissão do navegador.'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const participar = async () => {
    if (!selecionada || !token) return;
    const jaParticipa = user?.roles.some((role) => role.id_horta === selecionada.id && role.role === 'MEMBER') ?? false;
    setEntrando(true);
    try {
      const response = await fetch(`${API_URL}/hortas/${selecionada.id}/entrar`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Não foi possível entrar nesta horta.');
      if (data.user) applyUser(data.user);
      toast.success(jaParticipa ? 'Você já participa desta horta.' : 'Você agora participa desta horta!');
      if (!jaParticipa) {
        setHortas((current) => current.map((horta) => horta.id === selecionada.id
          ? { ...horta, participantes: Number(horta.participantes) + 1 }
          : horta));
      }
      setSelecionada(null);
      setModalAberto(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao entrar na horta.');
    } finally {
      setEntrando(false);
    }
  };

  const center = coordinates(selecionada ?? hortas[0] ?? ({} as Horta)) ?? posicao ?? { lat: -15.7939, lng: -47.8828 };
  const hortaDetalhada = detalhes?.id === selecionada?.id ? detalhes : null;
  const linkMapa = hortaDetalhada
    ? coordinates(hortaDetalhada)
      ? `https://www.google.com/maps/search/?api=1&query=${coordinates(hortaDetalhada)!.lat},${coordinates(hortaDetalhada)!.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([hortaDetalhada.endereco, hortaDetalhada.cidade, hortaDetalhada.uf].filter(Boolean).join(', '))}`
    : '';

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-4 pb-8 pt-5 text-[#17201a] sm:px-6 sm:pt-7 lg:px-9">
      <header className="mb-5 flex flex-col items-start justify-between gap-4 sm:mb-7 sm:flex-row sm:gap-6">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.13em] text-[#16803d]"><Compass className="size-4" /> Comunidade</p>
          <h1 className="text-[25px] font-bold leading-tight tracking-[-0.03em] sm:text-[30px]">Encontre uma horta para participar</h1>
          <p className="mt-2 max-w-3xl text-[13px] leading-5 text-[#66736a] sm:text-[14px]">Descubra comunidades próximas, participe de atividades e ajude a cultivar algo maior.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#d7efdc] bg-[#eaf7ed] px-4 py-2 text-[13px] font-semibold text-[#16803d] sm:mt-1 sm:text-[14px]">
          <Sprout className="size-[17px]" /><span>{saldo}</span><span className="font-medium text-[#45845a]">moedas</span>
        </div>
      </header>

      <section className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3" aria-label="Buscar hortas">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7a887e]" />
          <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome ou localização..." className="h-[50px] w-full rounded-xl border border-[#e1e8e2] bg-white pl-11 pr-4 text-[14px] outline-none transition focus:border-[#42a765] focus:ring-4 focus:ring-[#16a34a]/10" />
        </div>
        <button onClick={usarLocalizacao} className="inline-flex h-[46px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#168a3c] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#117331] sm:h-[50px] sm:w-auto sm:px-5 sm:text-[14px]">
          <MapPin className="size-[17px]" /> {posicao ? 'Localização ativa' : 'Usar minha localização'}
        </button>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar hortas">
        {filtros.map((opcao) => (
          <button key={opcao} onClick={() => {
            if (opcao === 'Mais próximas' && !posicao) toast.message('Ative sua localização para ordenar por distância.');
            setFiltro(opcao);
          }} className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition sm:px-4 sm:text-[12px] ${filtro === opcao ? 'border-[#c8e6ce] bg-[#eaf7ed] text-[#16803d]' : 'border-[#e4e9e5] bg-white text-[#5f6d63] hover:border-[#b9d8c1]'}`}>
            {opcao}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-[#78847b] sm:text-[12px]">{listaVisivel.length} {listaVisivel.length === 1 ? 'horta encontrada' : 'hortas encontradas'}</span>
      </div>

      <section className="grid min-h-[610px] grid-cols-[minmax(0,1.04fr)_minmax(430px,0.96fr)] gap-4 max-[1050px]:min-h-0 max-[1050px]:grid-cols-1 sm:gap-5">
        <div className="relative min-h-[610px] overflow-hidden rounded-2xl border border-[#e0e7e1] bg-[#e8eee8] shadow-[0_2px_10px_#183b2410] max-[1050px]:min-h-[380px] max-[640px]:min-h-[320px]">
          <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom className="h-full min-h-[610px] w-full max-[1050px]:min-h-[380px] max-[640px]:min-h-[320px]">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapBounds hortas={listaVisivel} selectedId={selecionada?.id ?? null} />
            {listaVisivel.map((horta) => {
              const point = coordinates(horta);
              if (!point) return null;
              return <Marker key={horta.id} position={[point.lat, point.lng]} icon={markerIcon(selecionada?.id === horta.id)} eventHandlers={{ click: () => setSelecionada(horta) }}>
                <Popup><strong>{horta.nome}</strong><br />{horta.endereco || 'Endereço não informado'}</Popup>
              </Marker>;
            })}
          </MapContainer>
          <div className="pointer-events-none absolute left-4 top-4 z-[500] flex items-center gap-2 rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-[12px] font-semibold text-[#34453a] shadow-sm backdrop-blur">
            <span className="size-2 rounded-full bg-[#16a34a]" /> Hortas comunitárias
          </div>
          <div className="absolute bottom-4 left-4 z-[500] rounded-lg border border-white/70 bg-white/95 px-3 py-2 text-[11px] text-[#718075] shadow-sm">{listaVisivel.filter((horta) => coordinates(horta)).length} locais no mapa</div>
        </div>

        <div className="flex min-h-[610px] flex-col overflow-hidden rounded-2xl border border-[#e6ebe6] bg-white shadow-[0_2px_10px_#183b2408] max-[1050px]:min-h-0">
          <div className="flex items-center justify-between border-b border-[#edf0ed] px-4 py-3.5 sm:px-5 sm:py-4">
            <div><h2 className="text-[16px] font-bold">Hortas da comunidade</h2><p className="mt-0.5 text-[12px] text-[#7a867d]">Conheça um espaço e faça parte</p></div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#f0f8f1] text-[#16803d]"><MapPinned className="size-[17px]" /></div>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
            {carregando && <div className="flex h-full min-h-48 items-center justify-center gap-2 text-[13px] text-[#718075]"><LoaderCircle className="size-4 animate-spin" /> Carregando hortas...</div>}
            {!carregando && listaVisivel.length === 0 && <div className="flex min-h-64 flex-col items-center justify-center text-center"><div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f0f8f1] text-[#16803d]"><Leaf className="size-5" /></div><p className="text-[14px] font-semibold">Nenhuma horta encontrada</p><p className="mt-1 max-w-[260px] text-[12px] leading-5 text-[#7a867d]">Tente outro nome ou remova os filtros para ver as hortas disponíveis.</p></div>}
            {listaVisivel.map((horta, index) => {
              const point = coordinates(horta);
              const distancia = posicao && point ? distanceKm(posicao, point) : null;
              const ativa = Number(horta.participantes) > 0;
              return <article key={horta.id} onClick={() => setSelecionada(horta)} className={`group flex cursor-pointer overflow-hidden rounded-xl border transition ${selecionada?.id === horta.id ? 'border-[#80c894] bg-[#fbfefb] shadow-[0_0_0_2px_#e5f5e9]' : 'border-[#e7ece7] bg-white hover:border-[#c7ddcc] hover:shadow-sm'}`}>
                <div className="relative w-[96px] shrink-0 overflow-hidden bg-[#edf3ed] sm:w-[132px]">
                  <img src={fotos[index % fotos.length]} alt={`Horta comunitária ${horta.nome}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#16803d] shadow-sm"><span className={`size-1.5 rounded-full ${ativa ? 'bg-[#22a052]' : 'bg-[#9ba69d]'}`} />{ativa ? 'Ativa' : 'Nova'}</span>
                </div>
                <div className="min-w-0 flex-1 p-2.5 sm:p-3.5">
                  <div className="flex items-start justify-between gap-2"><h3 className="truncate text-[14px] font-bold leading-5 text-[#1c2b20]">{horta.nome}</h3></div>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#758178]"><MapPin className="size-3 shrink-0 text-[#829187]" />{[horta.endereco, horta.cidade && horta.uf ? `${horta.cidade}/${horta.uf}` : horta.cidade || horta.uf].filter(Boolean).join(' · ') || 'Localização não informada'}</p>
                  <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] leading-[16px] text-[#58665c]">{horta.descricao || 'Um espaço coletivo para plantar, aprender e compartilhar com a comunidade.'}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-[#6c7a70]">
                    <span className="inline-flex items-center gap-1"><Users className="size-3.5 text-[#829187]" />{Number(horta.participantes)} participantes</span>
                    {distancia !== null && <span className="inline-flex items-center gap-1"><MapPin className="size-3 text-[#829187]" />{distancia < 10 ? distancia.toFixed(1) : Math.round(distancia)} km</span>}
                    {distancia === null && <span className="inline-flex items-center gap-1"><MapPin className="size-3 text-[#829187]" />Distância indisponível</span>}
                  </div>
                  <button onClick={(event) => { event.stopPropagation(); setSelecionada(horta); setModalAberto(true); }} className="mt-2.5 rounded-lg border border-[#dce9de] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#16803d] transition hover:border-[#9bcba6] hover:bg-[#f3faf4]">Ver horta</button>
                </div>
              </article>;
            })}
          </div>
          {!carregando && listaVisivel.length > 0 && <div className="flex items-center gap-2 border-t border-[#edf0ed] px-5 py-3 text-[11px] text-[#7a867d]"><Check className="size-3.5 text-[#299650]" /> Todas as hortas disponíveis estão listadas</div>}
        </div>
      </section>

      {selecionada && modalAberto && <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#102017]/45 p-3 sm:p-6" onClick={() => setModalAberto(false)}>
        <section role="dialog" aria-modal="true" aria-label={`Detalhes de ${selecionada.nome}`} className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#f8faf8] shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <header className="relative border-b border-[#e5ebe5] bg-white px-5 py-5 pr-14 sm:px-7">
            <button onClick={() => setModalAberto(false)} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-[#f2f6f2] text-[#34453a] hover:bg-[#e8f1e9]" aria-label="Fechar detalhes"><X className="size-4" /></button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf7ed] px-2.5 py-1 text-[11px] font-semibold text-[#16803d]"><span className="size-1.5 rounded-full bg-[#22a052]" />Horta comunitária</span>
            <h2 className="mt-3 text-[22px] font-bold tracking-tight text-[#17201a] sm:text-[26px]">{(hortaDetalhada ?? selecionada).nome}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#718075]"><MapPin className="size-4 shrink-0" />{[(hortaDetalhada ?? selecionada).cidade && (hortaDetalhada ?? selecionada).uf ? `${(hortaDetalhada ?? selecionada).cidade}/${(hortaDetalhada ?? selecionada).uf}` : (hortaDetalhada ?? selecionada).cidade || (hortaDetalhada ?? selecionada).uf, (hortaDetalhada ?? selecionada).endereco].filter(Boolean).join(' · ') || 'Localização não informada'}</p>
            {(hortaDetalhada ?? selecionada).descricao && <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#58665c]">{(hortaDetalhada ?? selecionada).descricao}</p>}
          </header>

          <div className="overflow-y-auto px-4 py-4 sm:px-7 sm:py-6">
            {carregandoDetalhes && <div role="status" className="mb-4 rounded-xl border border-[#e2e9e2] bg-white p-4 text-[13px] text-[#66736a]">Carregando informações da horta...</div>}
            {erroDetalhes && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-800">{erroDetalhes}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-[#e4eae4] bg-white p-4 sm:col-span-2"><div className="flex items-center gap-2"><Leaf className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Sobre a horta</h3></div><p className="mt-2 text-[13px] leading-6 text-[#58665c]">{hortaDetalhada?.descricao || 'Descrição e objetivos não informados.'}</p></article>

              <article className="rounded-xl border border-[#e4eae4] bg-white p-4"><div className="flex items-center gap-2"><MapPin className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Localização</h3></div><div className="mt-2 space-y-1 text-[12px] leading-5 text-[#58665c]">{hortaDetalhada?.endereco && <p>{hortaDetalhada.endereco}</p>}{(hortaDetalhada?.cidade || hortaDetalhada?.uf) && <p>{[hortaDetalhada.cidade, hortaDetalhada.uf].filter(Boolean).join(' / ')}</p>}{!hortaDetalhada?.endereco && !hortaDetalhada?.cidade && !hortaDetalhada?.uf && <p>Endereço não informado.</p>}</div>{hortaDetalhada && linkMapa && <a href={linkMapa} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#16803d] hover:underline">Abrir no mapa <ExternalLink className="size-3.5" /></a>}</article>

              <article className="rounded-xl border border-[#e4eae4] bg-white p-4"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Responsável pela horta</h3></div>{hortaDetalhada?.responsaveis?.length ? <ul className="mt-2 space-y-1 text-[13px] text-[#58665c]">{hortaDetalhada.responsaveis.map((nome, index) => <li key={`${nome}-${index}`}>{nome}</li>)}</ul> : <p className="mt-2 text-[12px] text-[#89948b]">Responsável não informado.</p>}</article>

              {hortaDetalhada?.contato && <article className="rounded-xl border border-[#e4eae4] bg-white p-4"><div className="flex items-center gap-2"><Mail className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Contato</h3></div><a href={hortaDetalhada.contato.includes('@') ? `mailto:${hortaDetalhada.contato}` : `tel:${hortaDetalhada.contato.replace(/[^+0-9]/g, '')}`} className="mt-2 inline-flex items-center gap-1.5 break-all text-[13px] text-[#16803d] hover:underline">{hortaDetalhada.contato.includes('@') ? <Mail className="size-3.5 shrink-0" /> : <Phone className="size-3.5 shrink-0" />}{hortaDetalhada.contato}</a></article>}

              <article className="rounded-xl border border-[#e4eae4] bg-white p-4"><div className="flex items-center gap-2"><Users className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Sobre a comunidade</h3></div><p className="mt-2 text-[13px] text-[#58665c]">{hortaDetalhada ? `${Number(hortaDetalhada.participantes) || 0} ${Number(hortaDetalhada.participantes) === 1 ? 'membro' : 'membros'}` : `${Number(selecionada.participantes) || 0} membros`}</p></article>

              <article className="rounded-xl border border-[#e4eae4] bg-white p-4"><div className="flex items-center gap-2"><ClipboardList className="size-4 text-[#16803d]" /><h3 className="text-[14px] font-semibold text-[#243328]">Atividades</h3></div><p className="mt-2 text-[13px] text-[#58665c]">{hortaDetalhada ? Number(hortaDetalhada.atividades_disponiveis) > 0 ? `${Number(hortaDetalhada.atividades_disponiveis)} atividades disponíveis` : 'Nenhuma atividade disponível no momento.' : 'Informações de atividades indisponíveis.'}</p></article>
            </div>
          </div>

          <footer className="border-t border-[#e5ebe5] bg-white p-4 sm:px-7"><button onClick={participar} disabled={entrando || Boolean(erroDetalhes)} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#168a3c] text-[13px] font-semibold text-white transition hover:bg-[#117331] disabled:opacity-60">{entrando && <LoaderCircle className="size-4 animate-spin" />}{entrando ? 'Entrando...' : user?.roles.some((role) => role.id_horta === selecionada.id && role.role === 'MEMBER') ? 'Você já participa desta horta' : 'Participar desta horta'}</button></footer>
        </section>
      </div>}
    </main>
  );
}
