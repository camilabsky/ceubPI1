import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfilePhoneEditor from './ProfilePhoneEditor';

vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ token: 'tok' }) }));
const toastError = vi.fn();
const toastSuccess = vi.fn();
vi.mock('sonner', () => ({ toast: { success: (...a: unknown[]) => toastSuccess(...a), error: (...a: unknown[]) => toastError(...a) } }));

let saved = '';
const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
  if (init?.method === 'PUT') {
    const { telefone } = JSON.parse(String(init.body));
    saved = telefone.trim();
    return new Response(JSON.stringify({ telefone: saved }), { status: 200 });
  }
  return new Response(JSON.stringify({ telefone: saved }), { status: 200 });
});

function puts() { return fetchMock.mock.calls.filter(([, init]) => init?.method === 'PUT'); }

beforeEach(() => {
  saved = '';
  fetchMock.mockClear();
  toastError.mockReset();
  toastSuccess.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

describe('ProfilePhoneEditor', () => {
  it('shows Telefone não informado when there is no phone', async () => {
    render(<ProfilePhoneEditor />);
    expect(await screen.findByText('Telefone não informado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar telefone' })).toBeInTheDocument();
  });

  it('shows the saved phone', async () => {
    saved = '(61) 98888-0000';
    render(<ProfilePhoneEditor />);
    expect(await screen.findByText('(61) 98888-0000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar telefone' })).toBeInTheDocument();
  });

  it('saves a valid phone', async () => {
    render(<ProfilePhoneEditor />);
    await userEvent.click(await screen.findByRole('button', { name: 'Adicionar telefone' }));
    await userEvent.type(screen.getByLabelText('Telefone'), '(61) 97777-0000');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar telefone' }));
    expect(await screen.findByText('(61) 97777-0000')).toBeInTheDocument();
    expect(JSON.parse(String(puts()[0][1]?.body))).toEqual({ telefone: '(61) 97777-0000' });
    expect(toastSuccess).toHaveBeenCalledWith('Telefone atualizado. Ele fica visível apenas para os administradores das suas hortas.');
  });

  it('rejects an invalid phone without calling the server', async () => {
    render(<ProfilePhoneEditor />);
    await userEvent.click(await screen.findByRole('button', { name: 'Adicionar telefone' }));
    await userEvent.type(screen.getByLabelText('Telefone'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar telefone' }));
    expect(toastError).toHaveBeenCalledWith('Informe um telefone válido');
    expect(puts()).toHaveLength(0);
  });

  it('clears the phone', async () => {
    saved = '(61) 98888-0000';
    render(<ProfilePhoneEditor />);
    await userEvent.click(await screen.findByRole('button', { name: 'Editar telefone' }));
    await userEvent.clear(screen.getByLabelText('Telefone'));
    await userEvent.click(screen.getByRole('button', { name: 'Salvar telefone' }));
    await waitFor(() => expect(screen.getByText('Telefone não informado')).toBeInTheDocument());
    expect(JSON.parse(String(puts()[0][1]?.body))).toEqual({ telefone: '' });
  });

  it('works in the card variant', async () => {
    render(<ProfilePhoneEditor variant="card" />);
    expect(await screen.findByRole('heading', { name: 'Seu telefone' })).toBeInTheDocument();
  });
});
