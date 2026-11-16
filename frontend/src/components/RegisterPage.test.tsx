import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from './RegisterPage';

const register = vi.fn();
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ register, isAuthenticating: false }) }));
vi.mock('./GoogleSignInButton', () => ({ default: ({ text }: { text: string }) => <div data-testid="google-button">{text}</div> }));
const toastError = vi.fn();
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: (...args: unknown[]) => toastError(...args) } }));

describe('RegisterPage', () => {
  beforeEach(() => { register.mockReset(); toastError.mockReset(); });

  it('shows only nome, e-mail and senha fields', () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    expect(screen.getByLabelText(/Nome/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/)).toBeInTheDocument();
    expect(screen.queryByText(/Telefone/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cidade/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^UF/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Confirmar senha/)).not.toBeInTheDocument();
  });

  it('offers Google first', () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    expect(screen.getByTestId('google-button')).toHaveTextContent('continue_with');
    expect(screen.getByText('ou com e-mail')).toBeInTheDocument();
  });

  it('submits with only three fields', async () => {
    register.mockResolvedValue(undefined);
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    await userEvent.type(screen.getByLabelText(/Nome/), 'Ana');
    await userEvent.type(screen.getByLabelText(/E-mail/), 'ana@x.test');
    await userEvent.type(screen.getByLabelText(/Senha/), 'segredo1');
    await userEvent.click(screen.getByRole('button', { name: /Criar conta/ }));
    expect(register).toHaveBeenCalledWith('Ana', 'ana@x.test', 'segredo1');
  });

  it('rejects short password', async () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    await userEvent.type(screen.getByLabelText(/Nome/), 'Ana');
    await userEvent.type(screen.getByLabelText(/E-mail/), 'ana@x.test');
    await userEvent.type(screen.getByLabelText(/Senha/), '123');
    await userEvent.click(screen.getByRole('button', { name: /Criar conta/ }));
    expect(register).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith('A senha deve ter no mínimo 6 caracteres');
  });
});
