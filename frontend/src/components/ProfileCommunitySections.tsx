import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import MyRedeemedRewardsSection, { type RedeemedReward } from './MyRedeemedRewardsSection';

interface ProfileHistory {
  recompensas_resgatadas: RedeemedReward[];
}

export default function ProfileCommunitySections() {
  const { token, isAdmin } = useAuth();
  const [history, setHistory] = useState<ProfileHistory>({ recompensas_resgatadas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/me/historico`, { headers: { Authorization: `Bearer ${token}` } });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Não foi possível carregar os resgates.');
        if (active) setHistory({ recompensas_resgatadas: result.recompensas_resgatadas || [] });
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : 'Erro ao carregar os dados do perfil.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [token]);

  return <>
    {!isAdmin && <MyRedeemedRewardsSection rewards={history.recompensas_resgatadas} loading={loading} />}
  </>;
}
