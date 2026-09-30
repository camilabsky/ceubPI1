import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUpRight, Check, Compass, Leaf, LoaderCircle, MapPin, MapPinned, Search, Sprout, Users, X } from 'lucide-react';
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
  participantes: number | string;
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
    ? { lat, lng }
    : null;
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
  const [posicao, setPosicao] = useState<Position | null>(null);
  const [selecionada, setSelecionada] = useState<Horta | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
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

  const listaVisivel = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    const encontrados = hortas.filter((horta) => `${horta.nome} ${horta.endereco ?? ''} ${horta.descricao ?? ''}`.toLocaleLowerCase('pt-BR').includes(termo));
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
      ({ coords }) => { setPosicao({ lat: coords.latitude, lng: coords.longitude }); setFiltro('Mais próximas'); },
      () => toast.error('Não foi possível acessar sua localização. Confira a permissão do navegador.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const participar = async () => {
    if (!selecionada || !token) return;
    const jaParticipa = user?.roles.some((role) => role.id_horta === selecionada.id) ?? false;
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

  return (
    <main className="min-h-screen bg-[#f7f9f7] px-6 pb-8 pt-7 text-[#17201a] lg:px-9">
      <header className="mb-7 flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.13em] text-[#16803d]"><Compass className="size-4" /> Comunidade</p>
          <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em]">Encontre uma horta para participar</h1>
          <p className="mt-2 text-[14px] text-[#66736a]">Descubra comunidades próximas, participe de atividades e ajude a cultivar algo maior.</p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2 rounded-full border border-[#d7efdc] bg-[#eaf7ed] px-4 py-2 text-[14px] font-semibold text-[#16803d]">
          <Sprout className="size-[17px]" /><span>{saldo}</span><span className="font-medium text-[#45845a]">moedas</span>
        </div>
      </header>

      <section className="mb-4 flex gap-3" aria-label="Buscar hortas">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7a887e]" />
          <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome ou localização..." className="h-[50px] w-full rounded-xl border border-[#e1e8e2] bg-white pl-11 pr-4 text-[14px] outline-none transition focus:border-[#42a765] focus:ring-4 focus:ring-[#16a34a]/10" />
        </div>
        <button onClick={usarLocalizacao} className="inline-flex h-[50px] shrink-0 items-center gap-2 rounded-xl bg-[#168a3c] px-5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#117331]">
          <MapPin className="size-[17px]" /> {posicao ? 'Localização ativa' : 'Usar minha localização'}
        </button>
      </section>

      <div className="mb-5 flex items-center gap-2" role="group" aria-label="Filtrar hortas">
        {filtros.map((opcao) => (
          <button key={opcao} onClick={() => {
            if (opcao === 'Mais próximas' && !posicao) toast.message('Ative sua localização para ordenar por distância.');
            setFiltro(opcao);
          }} className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition ${filtro === opcao ? 'border-[#c8e6ce] bg-[#eaf7ed] text-[#16803d]' : 'border-[#e4e9e5] bg-white text-[#5f6d63] hover:border-[#b9d8c1]'}`}>
            {opcao}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-[#78847b]">{listaVisivel.length} {listaVisivel.length === 1 ? 'horta encontrada' : 'hortas encontradas'}</span>
      </div>

      <section className="grid min-h-[610px] grid-cols-[minmax(0,1.04fr)_minmax(430px,0.96fr)] gap-5 max-[1050px]:grid-cols-1">
        <div className="relative min-h-[610px] overflow-hidden rounded-2xl border border-[#e0e7e1] bg-[#e8eee8] shadow-[0_2px_10px_#183b2410] max-[1050px]:min-h-[420px]">
          <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom className="h-full min-h-[610px] w-full max-[1050px]:min-h-[420px]">
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

        <div className="flex min-h-[610px] flex-col overflow-hidden rounded-2xl border border-[#e6ebe6] bg-white shadow-[0_2px_10px_#183b2408]">
          <div className="flex items-center justify-between border-b border-[#edf0ed] px-5 py-4">
            <div><h2 className="text-[16px] font-bold">Hortas da comunidade</h2><p className="mt-0.5 text-[12px] text-[#7a867d]">Conheça um espaço e faça parte</p></div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#f0f8f1] text-[#16803d]"><MapPinned className="size-[17px]" /></div>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {carregando && <div className="flex h-full min-h-48 items-center justify-center gap-2 text-[13px] text-[#718075]"><LoaderCircle className="size-4 animate-spin" /> Carregando hortas...</div>}
            {!carregando && listaVisivel.length === 0 && <div className="flex min-h-64 flex-col items-center justify-center text-center"><div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f0f8f1] text-[#16803d]"><Leaf className="size-5" /></div><p className="text-[14px] font-semibold">Nenhuma horta encontrada</p><p className="mt-1 max-w-[260px] text-[12px] leading-5 text-[#7a867d]">Tente outro nome ou remova os filtros para ver as hortas disponíveis.</p></div>}
            {listaVisivel.map((horta, index) => {
              const point = coordinates(horta);
              const distancia = posicao && point ? distanceKm(posicao, point) : null;
              const ativa = Number(horta.participantes) > 0;
              return <article key={horta.id} onClick={() => setSelecionada(horta)} className={`group flex cursor-pointer overflow-hidden rounded-xl border transition ${selecionada?.id === horta.id ? 'border-[#80c894] bg-[#fbfefb] shadow-[0_0_0_2px_#e5f5e9]' : 'border-[#e7ece7] bg-white hover:border-[#c7ddcc] hover:shadow-sm'}`}>
                <div className="relative w-[132px] shrink-0 overflow-hidden bg-[#edf3ed]">
                  <img src={fotos[index % fotos.length]} alt={`Horta comunitária ${horta.nome}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#16803d] shadow-sm"><span className={`size-1.5 rounded-full ${ativa ? 'bg-[#22a052]' : 'bg-[#9ba69d]'}`} />{ativa ? 'Ativa' : 'Nova'}</span>
                </div>
                <div className="min-w-0 flex-1 p-3.5">
                  <div className="flex items-start justify-between gap-2"><h3 className="truncate text-[14px] font-bold leading-5 text-[#1c2b20]">{horta.nome}</h3><ArrowUpRight className="mt-0.5 size-4 shrink-0 text-[#91a095] transition group-hover:text-[#16803d]" /></div>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#758178]"><MapPin className="size-3 shrink-0 text-[#829187]" />{horta.endereco || 'Localização não informada'}</p>
                  <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] leading-[16px] text-[#58665c]">{horta.descricao || 'Um espaço coletivo para plantar, aprender e compartilhar com a comunidade.'}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-medium text-[#6c7a70]">
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

      {selecionada && modalAberto && <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#102017]/35 p-4" onClick={() => setModalAberto(false)}>
        <div role="dialog" aria-modal="true" aria-label={selecionada.nome} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="relative h-48 bg-[#eaf1e9]"><img src={fotos[Math.max(0, hortas.findIndex((horta) => horta.id === selecionada.id)) % fotos.length]} alt={`Horta ${selecionada.nome}`} className="h-full w-full object-cover" /><button onClick={() => setModalAberto(false)} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/95 text-[#34453a] shadow-sm" aria-label="Fechar"><X className="size-4" /></button></div>
          <div className="p-5"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf7ed] px-2.5 py-1 text-[11px] font-semibold text-[#16803d]"><span className="size-1.5 rounded-full bg-[#22a052]" />Comunidade ativa</span><h2 className="mt-3 text-[20px] font-bold">{selecionada.nome}</h2><p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#718075]"><MapPin className="size-3.5" />{selecionada.endereco || 'Localização não informada'}</p><p className="mt-4 text-[13px] leading-6 text-[#58665c]">{selecionada.descricao || 'Um espaço coletivo para plantar, aprender e compartilhar com a comunidade.'}</p><div className="mt-4 flex items-center gap-2 text-[12px] text-[#657369]"><Users className="size-4 text-[#16803d]" />{Number(selecionada.participantes)} participantes</div><button onClick={participar} disabled={entrando} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#168a3c] text-[13px] font-semibold text-white transition hover:bg-[#117331] disabled:opacity-60">{entrando && <LoaderCircle className="size-4 animate-spin" />}{entrando ? 'Entrando...' : user?.roles.some((role) => role.id_horta === selecionada.id) ? 'Você já participa desta horta' : 'Participar desta horta'}</button></div>
        </div>
      </div>}
    </main>
  );
}
