// Validação compartilhada de telefone e cidade/UF do usuário.
const ESTADOS = new Set(['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']);
const PHONE_PATTERN = /^\+?[0-9 ()-]{8,20}$/;
const CITY_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u;

function parsePhone(value) {
  if (value === undefined || value === null) return { ok: true, telefone: null };
  if (typeof value !== 'string') return { ok: false, error: 'Informe um telefone válido' };
  const telefone = value.trim();
  if (!telefone) return { ok: true, telefone: null };
  if (telefone.length > 24 || !PHONE_PATTERN.test(telefone)) return { ok: false, error: 'Informe um telefone válido' };
  return { ok: true, telefone };
}

function parseLocation(cidadeInput, ufInput) {
  const cidade = typeof cidadeInput === 'string' ? cidadeInput.trim() : '';
  const uf = typeof ufInput === 'string' ? ufInput.trim().toUpperCase() : '';
  if (!cidade && !uf) return { ok: true, cidade: null, uf: null };
  if (!cidade || !uf) return { ok: false, error: 'Informe cidade e UF juntas, ou deixe ambas vazias' };
  if (cidade.length > 100 || !CITY_PATTERN.test(cidade)) return { ok: false, error: 'Informe uma cidade válida com até 100 caracteres' };
  if (!ESTADOS.has(uf)) return { ok: false, error: 'Informe uma UF brasileira válida com duas letras' };
  return { ok: true, cidade, uf };
}

module.exports = { ESTADOS, parsePhone, parseLocation };
