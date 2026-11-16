import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ExploreLocationPrompt from './ExploreLocationPrompt';

function setup(onSaveCity = vi.fn().mockResolvedValue(true)) {
  const onUseLocation = vi.fn();
  const onDismiss = vi.fn();
  render(<ExploreLocationPrompt onUseLocation={onUseLocation} onSaveCity={onSaveCity} onDismiss={onDismiss} />);
  return { onUseLocation, onDismiss, onSaveCity };
}

describe('ExploreLocationPrompt', () => {
  it('shows the copy', () => {
    setup();
    expect(screen.getByText('Onde você está?')).toBeInTheDocument();
    expect(screen.getByText('Mostramos as hortas mais perto de você.')).toBeInTheDocument();
  });

  it('uses device location', async () => {
    const { onUseLocation } = setup();
    await userEvent.click(screen.getByRole('button', { name: /Usar minha localização/ }));
    expect(onUseLocation).toHaveBeenCalledTimes(1);
  });

  it('dismisses with Agora não', async () => {
    const { onDismiss } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Agora não' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('saves city with upper-cased two-letter UF', async () => {
    const { onSaveCity } = setup();
    await userEvent.type(screen.getByLabelText('Cidade'), 'Brasília');
    await userEvent.type(screen.getByLabelText('UF'), 'dfx');
    expect(screen.getByLabelText('UF')).toHaveValue('DF');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onSaveCity).toHaveBeenCalledWith('Brasília', 'DF');
  });

  it('disables save while saving', async () => {
    let resolve: (value: boolean) => void = () => {};
    const onSaveCity = vi.fn(() => new Promise<boolean>((r) => { resolve = r; }));
    setup(onSaveCity);
    await userEvent.type(screen.getByLabelText('Cidade'), 'Brasília');
    await userEvent.type(screen.getByLabelText('UF'), 'DF');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(screen.getByRole('button', { name: /Salvando/ })).toBeDisabled();
    resolve(false);
    expect(await screen.findByRole('button', { name: 'Salvar' })).toBeEnabled();
  });
});
