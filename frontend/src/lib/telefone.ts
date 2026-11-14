// Utilitários de telefone brasileiro (fixo e celular).
// Formatos aceitos: (61) 3333-4444  e  (61) 99999-8888

/** Mantém apenas os dígitos e limita a 11 (DDD + 9 dígitos). */
export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 11);
}

/**
 * Aplica a máscara progressivamente, enquanto o usuário digita.
 * Os caracteres fixos só aparecem quando já existe um dígito depois deles;
 * isso permite apagar com Backspace sem o campo "travar".
 */
export function formatarTelefone(valor: string): string {
  const d = apenasDigitos(valor);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Valida DDD (11 a 99) e quantidade de dígitos (10 fixo, 11 celular começando com 9). */
export function telefoneValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11 && d[2] !== '9') return false;
  return true;
}
