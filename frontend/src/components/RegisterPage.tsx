import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { UserPlus, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Horta {
  id: number;
  nome: string;
}

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register, isLoading } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modo, setModo] = useState<'existente' | 'nova'>('existente');
  const [hortas, setHortas] = useState<Horta[]>([]);
  const [idHortaSelecionada, setIdHortaSelecionada] = useState<string>('');
  const [nomeNovaHorta, setNomeNovaHorta] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [endereco, setEndereco] = useState('');
  const [isFetchingGeoLocation, setIsFetchingGeoLocation] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/hortas`)
      .then((res) => res.json())
      .then((data) => setHortas(data))
      .catch((error) => console.error('Erro ao carregar hortas:', error));
  }, []);

  const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Geolocalização não é suportada neste navegador');
    return;
  }

  setIsFetchingGeoLocation(true);
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLatitude(lat.toFixed(8));
      setLongitude(lng.toFixed(8));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        if (data?.display_name) {
          setEndereco(data.display_name);
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        toast.error('Não foi possível identificar o endereço automaticamente, preencha manualmente');
      } finally {
        setIsFetchingGeoLocation(false);
      }
    },
    (error) => {
      console.error('Erro ao obter localização:', error);
      toast.error('Não foi possível obter sua localização atual');
      setIsFetchingGeoLocation(false);
    }
  );
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      toast.error('Preencha nome, email e senha');
      return;
    }

    if (modo === 'nova') {
      if (!nomeNovaHorta.trim()) {
        toast.error('Informe o nome da nova horta');
        return;
      }
      if (!latitude || !longitude || !endereco.trim()) {
        toast.error('É obrigatório informar a localização da horta');
        return;
      }
    }

    try {
      const opts =
        modo === 'existente'
          ? { id_horta: Number(idHortaSelecionada) }
          : {
              nome_nova_horta: nomeNovaHorta,
              latitude: Number(latitude),
              longitude: Number(longitude),
              endereco: endereco.trim(),
            };
      await register(nome, email, senha, opts);
      toast.success('Cadastro realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00a63e] to-[#008236] flex items-center justify-center px-4">
      <div className="bg-white rounded-[20px] p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#00a63e] rounded-full p-3">
            <Sprout className="size-8 text-white" />
          </div>
        </div>
        <h1 className="text-[24px] text-neutral-950 font-bold text-center mb-2">
          Criar conta
        </h1>
        <p className="text-[14px] text-[#717182] text-center mb-8">
          Junte-se a uma horta ou comece a sua
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-[#4a5565] mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-[13px] text-[#4a5565] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="seu.email@example.com"
            />
          </div>
          <div>
            <label className="block text-[13px] text-[#4a5565] mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              placeholder="Sua senha"
            />
          </div>

          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setModo('existente')}
              className={`flex-1 py-2 text-[13px] transition-colors ${
                modo === 'existente' ? 'bg-[#00a63e] text-white' : 'bg-white text-[#4a5565]'
              }`}
            >
              Ja participo de uma horta
            </button>
            <button
              type="button"
              onClick={() => setModo('nova')}
              className={`flex-1 py-2 text-[13px] transition-colors ${
                modo === 'nova' ? 'bg-[#00a63e] text-white' : 'bg-white text-[#4a5565]'
              }`}
            >
              Vou começar uma horta
            </button>
          </div>

          {modo === 'existente' ? (
            <div>
              <label className="block text-[13px] text-[#4a5565] mb-2">Horta</label>
              <select
                value={idHortaSelecionada}
                onChange={(e) => setIdHortaSelecionada(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
              >
                <option value="">Selecione uma horta</option>
                {hortas.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#4a5565] mb-2">Nome da nova horta</label>
                <input
                  type="text"
                  value={nomeNovaHorta}
                  onChange={(e) => setNomeNovaHorta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e]"
                  placeholder="Ex: Horta do Bairro Sul"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[#4a5565] mb-2">
                  Localização da horta <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isFetchingGeoLocation}
                  className="w-full mb-3 flex items-center justify-center gap-2 rounded-lg border border-[#00a63e] text-[#00a63e] py-2.5 text-[13px] font-medium disabled:opacity-60"
                >
                  {isFetchingGeoLocation ? 'Obtendo localização...' : 'Usar minha localização atual'}
                </button>

                <textarea
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Endereço da horta"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#00a63e] mb-3 min-h-16"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#00a63e]"
                  />
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#00a63e]"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00a63e] text-white text-[14px] py-3 rounded-lg hover:bg-[#008236] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 font-semibold"
          >
            <UserPlus className="size-4" />
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-center text-[13px] text-[#00a63e] mt-4 hover:underline"
        >
          Ja tenho conta
        </button>
      </div>
    </div>
  );
}