const test = require('node:test');
const assert = require('node:assert/strict');
const { ESTADOS, parsePhone, parseEmail, parseLocation } = require('./userContact');

test('ESTADOS contém as 27 UFs', () => {
  assert.equal(ESTADOS.size, 27);
  assert.ok(ESTADOS.has('DF'));
});

test('parsePhone aceita vazio como sem telefone', () => {
  assert.deepEqual(parsePhone(undefined), { ok: true, telefone: null });
  assert.deepEqual(parsePhone(null), { ok: true, telefone: null });
  assert.deepEqual(parsePhone('   '), { ok: true, telefone: null });
});

test('parsePhone valida e apara', () => {
  assert.deepEqual(parsePhone(' (61) 99999-0000 '), { ok: true, telefone: '(61) 99999-0000' });
  assert.deepEqual(parsePhone('+55 61 99999-0000'), { ok: true, telefone: '+55 61 99999-0000' });
  assert.equal(parsePhone('abc').ok, false);
  assert.equal(parsePhone('1234567').ok, false);
  assert.equal(parsePhone('+'.padEnd(22, '1')).ok, false);
  assert.equal(parsePhone(12345678).ok, false);
  assert.equal(typeof parsePhone('abc').error, 'string');
});

test('parseLocation exige cidade e UF juntas', () => {
  assert.deepEqual(parseLocation('', ''), { ok: true, cidade: null, uf: null });
  assert.deepEqual(parseLocation(undefined, undefined), { ok: true, cidade: null, uf: null });
  assert.deepEqual(parseLocation(' Brasília ', 'df'), { ok: true, cidade: 'Brasília', uf: 'DF' });
  assert.equal(parseLocation('Brasília', '').ok, false);
  assert.equal(parseLocation('', 'DF').ok, false);
  assert.equal(parseLocation('Brasília', 'XX').ok, false);
  assert.equal(parseLocation('123', 'DF').ok, false);
  assert.equal(parseLocation('A'.repeat(101), 'DF').ok, false);
});

test('parseLocation rejeita cidade ou UF que não sejam texto', () => {
  assert.equal(parseLocation(123, undefined).ok, false);
  assert.equal(parseLocation(123, 'DF').ok, false);
  assert.equal(parseLocation('Brasília', 53).ok, false);
  assert.equal(parseLocation({}, []).ok, false);
  assert.deepEqual(parseLocation(null, null), { ok: true, cidade: null, uf: null });
});

test('parseEmail aceita vazio como sem e-mail', () => {
  assert.deepEqual(parseEmail(undefined), { ok: true, email: null });
  assert.deepEqual(parseEmail(null), { ok: true, email: null });
  assert.deepEqual(parseEmail('   '), { ok: true, email: null });
});

test('parseEmail valida e apara', () => {
  assert.deepEqual(parseEmail(' contato@horta.org '), { ok: true, email: 'contato@horta.org' });
  assert.equal(parseEmail('invalido').ok, false);
  assert.equal(parseEmail('sem-arroba.com').ok, false);
  assert.equal(parseEmail('a@b.com'.padEnd(161, 'x')).ok, false);
  assert.equal(parseEmail(123).ok, false);
  assert.equal(typeof parseEmail('invalido').error, 'string');
});
