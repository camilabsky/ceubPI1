import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ExplorePage from './ExplorePage';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({ fitBounds: vi.fn(), setView: vi.fn(), flyTo: vi.fn(), getZoom: () => 13 }),
}));
vi.mock('leaflet', () => ({ default: { divIcon: () => ({}), latLngBounds: () => ({ isValid: () => false }) } }));
vi.mock('leaflet/dist/leaflet.css', () => ({}));

const auth = { token: 'tok', user: { id: 1, roles: [] as Array<{ id_horta: number; role: string }> }, applyUser: vi.fn() };
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), message: vi.fn() }) }));

type Route = (init?: RequestInit) => { status?: number; body: unknown };
let routes: Record<string, Route>;
const calls: Array<{ key: string; init?: RequestInit }> = [];

function route(url: string, init?: RequestInit) {
  const method = init?.method || 'GET';
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const key = `${method} ${path}`;
  calls.push({ key, init });
  const handler: Route | undefined = routes[key] || (url.includes('nominatim') ? () => ({ body: [] }) : undefined);
  if (!handler) return Promise.resolve(new Response(JSON.stringify({ error: `unmocked ${key}` }), { status: 404 }));
  const { status = 200, body } = handler(init);
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

const horta = { id: 7, nome: 'Horta Girassol', descricao: 'Teste', latitude: -15.79, longitude: -47.88, endereco: 'Rua 1', cidade: 'Brasília', uf: 'DF', contato: 'h@x.test', participantes: 3 };

beforeEach(() => {
  calls.length = 0;
  auth.user = { id: 1, roles: [] };
  auth.applyUser.mockReset();
  routes = {
    'GET /hortas': () => ({ body: [horta] }),
    'POST /minhas_moedas': () => ({ body: { Saldo: 0 } }),
    'GET /me/localizacao': () => ({ body: { cidade: '', uf: '' } }),
    'PUT /me/localizacao': (init) => ({ body: JSON.parse(String(init?.body)) }),
    'GET /hortas/7/detalhes': () => ({ body: { ...horta, tarefas: [], administradores: [] } }),
    'GET /me/telefone': () => ({ body: { telefone: '' } }),
    'POST /hortas/7/entrar': () => ({ body: { id_horta: 7, user: { id: 1, roles: [{ id_horta: 7, role: 'MEMBER' }] } } }),
  };
  vi.stubGlobal('fetch', vi.fn(route));
});

describe('ExplorePage city prompt', () => {
  it('asks where the person is when the profile has no city', async () => {
    render(<ExplorePage />);
    expect(await screen.findByText('Onde você está?')).toBeInTheDocument();
    expect(screen.getAllByText('Horta Girassol').length).toBeGreaterThan(0);
  });

  it('does not ask when the profile already has a city', async () => {
    routes['GET /me/localizacao'] = () => ({ body: { cidade: 'Brasília', uf: 'DF' } });
    render(<ExplorePage />);
    await screen.findAllByText('Horta Girassol');
    await waitFor(() => expect(calls.some((c) => c.key === 'GET /me/localizacao')).toBe(true));
    expect(screen.queryByText('Onde você está?')).not.toBeInTheDocument();
  });

  it('Agora não hides the card for good', async () => {
    const { unmount } = render(<ExplorePage />);
    await userEvent.click(await screen.findByRole('button', { name: 'Agora não' }));
    expect(screen.queryByText('Onde você está?')).not.toBeInTheDocument();
    unmount();
    render(<ExplorePage />);
    await screen.findAllByText('Horta Girassol');
    await waitFor(() => expect(calls.filter((c) => c.key === 'GET /me/localizacao').length).toBeGreaterThan(1));
    expect(screen.queryByText('Onde você está?')).not.toBeInTheDocument();
  });

  it('saving a city stores it on the profile and hides the card', async () => {
    render(<ExplorePage />);
    await screen.findByText('Onde você está?');
    await userEvent.type(screen.getByLabelText('Cidade'), 'Brasília');
    await userEvent.type(screen.getByLabelText('UF'), 'DF');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    await waitFor(() => expect(screen.queryByText('Onde você está?')).not.toBeInTheDocument());
    const put = calls.find((c) => c.key === 'PUT /me/localizacao');
    expect(JSON.parse(String(put?.init?.body))).toEqual({ cidade: 'Brasília', uf: 'DF' });
  });

  it('keeps the card open when saving fails', async () => {
    routes['PUT /me/localizacao'] = () => ({ status: 400, body: { error: 'Informe uma UF brasileira válida com duas letras' } });
    render(<ExplorePage />);
    await screen.findByText('Onde você está?');
    await userEvent.type(screen.getByLabelText('Cidade'), 'Brasília');
    await userEvent.type(screen.getByLabelText('UF'), 'XX');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    await screen.findByRole('button', { name: 'Salvar' });
    expect(screen.getByText('Onde você está?')).toBeInTheDocument();
  });
});
