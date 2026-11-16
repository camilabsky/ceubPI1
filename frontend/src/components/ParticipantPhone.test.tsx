import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ParticipantPhone from './ParticipantPhone';

describe('ParticipantPhone', () => {
  it('renders a tappable tel: link with digits only', () => {
    render(<ParticipantPhone telefone="(61) 99999-0000" />);
    const link = screen.getByRole('link', { name: /\(61\) 99999-0000/ });
    expect(link).toHaveAttribute('href', 'tel:61999990000');
  });

  it('keeps the leading plus for international numbers', () => {
    render(<ParticipantPhone telefone="+55 61 99999-0000" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'tel:+5561999990000');
  });

  it('says Telefone não informado when missing', () => {
    render(<ParticipantPhone telefone={null} />);
    expect(screen.getByText('Telefone não informado')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
