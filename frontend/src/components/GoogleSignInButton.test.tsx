import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleSignInButton from './GoogleSignInButton';

const loginWithGoogle = vi.fn();
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ loginWithGoogle }) }));
const toastError = vi.fn();
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: (...args: unknown[]) => toastError(...args) } }));

describe('GoogleSignInButton', () => {
  let initialize: ReturnType<typeof vi.fn>;
  let renderButton: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loginWithGoogle.mockReset();
    toastError.mockReset();
    initialize = vi.fn();
    renderButton = vi.fn();
    window.google = { accounts: { id: { initialize, renderButton } } };
  });

  it('renders the Google button with the requested text', () => {
    render(<GoogleSignInButton text="continue_with" />);
    expect(renderButton).toHaveBeenCalledTimes(1);
    expect(renderButton.mock.calls[0][1]).toMatchObject({ text: 'continue_with' });
  });

  it('logs in with the Google credential', async () => {
    loginWithGoogle.mockResolvedValue(undefined);
    render(<GoogleSignInButton text="signin_with" />);
    await initialize.mock.calls[0][0].callback({ credential: 'cred-123' });
    expect(loginWithGoogle).toHaveBeenCalledWith('cred-123');
  });

  it('shows an error toast when Google login fails', async () => {
    loginWithGoogle.mockRejectedValue(new Error('x'));
    render(<GoogleSignInButton text="signin_with" />);
    await initialize.mock.calls[0][0].callback({ credential: 'bad' });
    await waitFor(() => expect(toastError).toHaveBeenCalledWith('Nao foi possivel entrar com Google'));
  });
});
