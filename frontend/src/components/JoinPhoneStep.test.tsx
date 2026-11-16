import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import JoinPhoneStep from './JoinPhoneStep';

function setup(props: Partial<{ busy: boolean; serverError: string }> = {}) {
  const onJoin = vi.fn();
  const onSkip = vi.fn();
  render(<JoinPhoneStep onJoin={onJoin} onSkip={onSkip} busy={props.busy ?? false} serverError={props.serverError ?? ''} />);
  return { onJoin, onSkip };
}

describe('JoinPhoneStep', () => {
  it('explains why the phone is asked', () => {
    setup();
    expect(screen.getByText('Quer deixar um telefone? O administrador da horta pode precisar falar com você.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(61) 99999-9999 (opcional)')).toBeInTheDocument();
  });

  it('blocks an invalid phone with an inline error', async () => {
    const { onJoin } = setup();
    await userEvent.type(screen.getByLabelText('Telefone'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na horta' }));
    expect(onJoin).not.toHaveBeenCalled();
    expect(screen.getByText('Informe um telefone válido ou toque em Pular')).toBeInTheDocument();
  });

  it('joins with a valid phone', async () => {
    const { onJoin } = setup();
    await userEvent.type(screen.getByLabelText('Telefone'), ' (61) 99999-0000 ');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na horta' }));
    expect(onJoin).toHaveBeenCalledWith('(61) 99999-0000');
  });

  it('joins without a phone when the field is empty', async () => {
    const { onJoin } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na horta' }));
    expect(onJoin).toHaveBeenCalledWith(undefined);
  });

  it('Pular skips', async () => {
    const { onSkip, onJoin } = setup();
    await userEvent.type(screen.getByLabelText('Telefone'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Pular' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onJoin).not.toHaveBeenCalled();
  });

  it('shows the server error and disables buttons while busy', () => {
    setup({ busy: true, serverError: 'Informe um telefone válido' });
    expect(screen.getByText('Informe um telefone válido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrando/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pular' })).toBeDisabled();
  });
});
