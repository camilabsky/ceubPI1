import { render, screen, waitFor, within } from '@testing-library/react';
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
const toastMock = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), message: vi.fn() }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), toastMock) }));

type RouteResult = { status?: number; body: unknown };
type Route = (init?: RequestInit) => RouteResult | Promise<RouteResult>;
let routes: Record<string, Route>;
const calls: Array<{ key: string; init?: RequestInit }> = [];

function route(url: string, init?: RequestInit) {
  const method = init?.method || 'GET';
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  const key = `${method} ${path}`;
  calls.push({ key, init });
  const handler: Route | undefined = routes[key] || (url.includes('nominatim') ? () => ({ body: [] }) : undefined);
  if (!handler) return Promise.resolve(new Response(JSON.stringify({ error: `unmocked ${key}` }), { status: 404 }));
  return Promise.resolve(handler(init)).then(({ status = 200, body }) => new Response(JSON.stringify(body), { status }));
}

const horta = { id: 7, nome: 'Horta Girassol', descricao: 'Teste', latitude: -15.79, longitude: -47.88, endereco: 'Rua 1', cidade: 'Brasília', uf: 'DF', telefone: null, email: 'h@x.test', participantes: 3 };

beforeEach(() => {
  calls.length = 0;
  toastMock.error.mockReset();
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

  it('keeps the card when the browser refuses the location', async () => {
    vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition: (_ok: unknown, fail: () => void) => fail() } });
    render(<ExplorePage />);
    const card = await screen.findByRole('region', { name: 'Onde você está?' });
    await userEvent.click(within(card).getByRole('button', { name: /Usar minha localização/ }));
    expect(screen.getByText('Onde você está?')).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });

  it('hides the card once the browser gives a location', async () => {
    vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition: (ok: (p: unknown) => void) => ok({ coords: { latitude: -15.79, longitude: -47.88 } }) } });
    render(<ExplorePage />);
    const card = await screen.findByRole('region', { name: 'Onde você está?' });
    await userEvent.click(within(card).getByRole('button', { name: /Usar minha localização/ }));
    await waitFor(() => expect(screen.queryByText('Onde você está?')).not.toBeInTheDocument());
    expect(localStorage.getItem('couve:explore-location-prompt-dismissed:1')).toBe('1');
  });

  it('another account on the same device still gets asked', async () => {
    localStorage.setItem('couve:explore-location-prompt-dismissed:99', '1');
    render(<ExplorePage />);
    expect(await screen.findByText('Onde você está?')).toBeInTheDocument();
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

async function openGarden() {
  render(<ExplorePage />);
  await userEvent.click(await screen.findByRole('button', { name: 'Ver horta' }));
}

function joinBody() {
  const join = calls.find((c) => c.key === 'POST /hortas/7/entrar');
  return join ? JSON.parse(String(join.init?.body ?? '{}')) : undefined;
}

describe('ExplorePage join phone step', () => {
  it('asks for a phone when the person has none, and Pular joins without one', async () => {
    await openGarden();
    await userEvent.click(await screen.findByRole('button', { name: 'Participar desta horta' }));
    expect(screen.getByText(/Quer deixar um telefone\?/)).toBeInTheDocument();
    expect(joinBody()).toBeUndefined();
    await userEvent.click(screen.getByRole('button', { name: 'Pular' }));
    await waitFor(() => expect(joinBody()).toEqual({}));
    expect(auth.applyUser).toHaveBeenCalled();
  });

  it('sends the typed phone with the join', async () => {
    await openGarden();
    await userEvent.click(await screen.findByRole('button', { name: 'Participar desta horta' }));
    await userEvent.type(screen.getByLabelText('Telefone'), '(61) 99999-0000');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na horta' }));
    await waitFor(() => expect(joinBody()).toEqual({ telefone: '(61) 99999-0000' }));
  });

  it('joins directly when the person already has a phone', async () => {
    routes['GET /me/telefone'] = () => ({ body: { telefone: '(61) 98888-0000' } });
    await openGarden();
    const button = await screen.findByRole('button', { name: 'Participar desta horta' });
    await waitFor(() => expect(calls.some((c) => c.key === 'GET /me/telefone')).toBe(true));
    await userEvent.click(button);
    await waitFor(() => expect(joinBody()).toEqual({}));
    expect(screen.queryByText(/Quer deixar um telefone\?/)).not.toBeInTheDocument();
  });

  it('keeps the step open with the server error when the phone is rejected', async () => {
    routes['POST /hortas/7/entrar'] = () => ({ status: 400, body: { error: 'Informe um telefone válido' } });
    await openGarden();
    await userEvent.click(await screen.findByRole('button', { name: 'Participar desta horta' }));
    await userEvent.type(screen.getByLabelText('Telefone'), '(61) 99999-0000');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na horta' }));
    expect(await screen.findByText('Informe um telefone válido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pular' })).toBeEnabled();
  });

  it('waits for the saved phone before letting the person join', async () => {
    let release: () => void = () => {};
    routes['GET /me/telefone'] = () => new Promise((resolve) => { release = () => resolve({ body: { telefone: '(61) 98888-0000' } }); });
    await openGarden();
    const button = await screen.findByRole('button', { name: 'Participar desta horta' });
    await waitFor(() => expect(calls.some((c) => c.key === 'GET /me/telefone')).toBe(true));
    expect(button).toBeDisabled();
    release();
    await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);
    await waitFor(() => expect(joinBody()).toEqual({}));
    expect(screen.queryByText(/Quer deixar um telefone\?/)).not.toBeInTheDocument();
  });

  it('falls back to the optional step when the saved phone cannot be loaded', async () => {
    routes['GET /me/telefone'] = () => ({ status: 500, body: { error: 'falhou' } });
    await openGarden();
    const button = await screen.findByRole('button', { name: 'Participar desta horta' });
    await waitFor(() => expect(button).toBeEnabled());
    await userEvent.click(button);
    expect(screen.getByText(/Quer deixar um telefone\?/)).toBeInTheDocument();
  });

  it('shows non-phone join errors as a toast, not under the phone field', async () => {
    routes['POST /hortas/7/entrar'] = () => ({ status: 404, body: { error: 'Horta nao encontrada' } });
    await openGarden();
    await userEvent.click(await screen.findByRole('button', { name: 'Participar desta horta' }));
    await userEvent.click(screen.getByRole('button', { name: 'Pular' }));
    await waitFor(() => expect(toastMock.error).toHaveBeenCalledWith('Horta nao encontrada'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pular' })).toBeEnabled();
  });

  it('does not ask members who already participate', async () => {
    auth.user = { id: 1, roles: [{ id_horta: 7, role: 'MEMBER' }] };
    await openGarden();
    expect(await screen.findByRole('button', { name: 'Você já participa desta horta' })).toBeInTheDocument();
    expect(calls.some((c) => c.key === 'GET /me/telefone')).toBe(false);
  });
});
