const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

const api = process.env.API_URL || 'http://localhost:8082';
const suffix = `${Date.now()}`;
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3308),
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'horta'
});

async function request(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

let counter = 0;
function email(name) { counter += 1; return `${name.toLowerCase()}-${counter}-${suffix}@example.test`; }

async function registerMinimal(name) {
  const result = await request('/auth/register', { method: 'POST', body: { nome: name, email: email(name), senha: 'Cadastro!123' } });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  return result.data;
}

async function userRow(id) {
  const [rows] = await db.query('SELECT telefone, cidade, uf FROM Usuario WHERE id = ?', [id]);
  return rows[0];
}

async function registerScenarios() {
  const minimal = await registerMinimal('Minimo');
  assert.deepEqual(await userRow(minimal.user.id), { telefone: null, cidade: null, uf: null });

  let result = await request('/auth/register', { method: 'POST', body: { nome: 'Fone Ruim', email: email('foneruim'), senha: 'Cadastro!123', telefone: 'abc' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  result = await request('/auth/register', { method: 'POST', body: { nome: 'Sem UF', email: email('semuf'), senha: 'Cadastro!123', cidade: 'Brasília' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));

  result = await request('/auth/register', { method: 'POST', body: {
    nome: 'Completo', email: email('completo'), senha: 'Cadastro!123', telefone: '(61) 99999-0000', cidade: 'Brasília', uf: 'df',
  } });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  assert.deepEqual(await userRow(result.data.user.id), { telefone: '(61) 99999-0000', cidade: 'Brasília', uf: 'DF' });
  return minimal;
}

async function phoneScenarios(minimal) {
  const { token } = minimal;
  let result = await request('/me/telefone', { token });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.deepEqual(result.data, { telefone: '' });

  result = await request('/me/telefone', { token, method: 'PUT', body: { telefone: ' (61) 98888-0000 ' } });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.deepEqual(result.data, { telefone: '(61) 98888-0000' });
  assert.deepEqual((await request('/me/telefone', { token })).data, { telefone: '(61) 98888-0000' });

  result = await request('/me/telefone', { token, method: 'PUT', body: { telefone: 'abc' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  assert.deepEqual((await request('/me/telefone', { token })).data, { telefone: '(61) 98888-0000' });

  // A body without the telefone key must not wipe the saved phone.
  result = await request('/me/telefone', { token, method: 'PUT', body: { phone: '(61) 91111-0000' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  result = await request('/me/telefone', { token, method: 'PUT', body: {} });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  assert.deepEqual((await request('/me/telefone', { token })).data, { telefone: '(61) 98888-0000' });

  result = await request('/me/telefone', { token, method: 'PUT', body: { telefone: '' } });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.deepEqual((await request('/me/telefone', { token })).data, { telefone: '' });
  assert.equal((await userRow(minimal.user.id)).telefone, null);

  result = await request('/me/localizacao', { token, method: 'PUT', body: { cidade: 'Brasília' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  result = await request('/me/localizacao', { token, method: 'PUT', body: { cidade: ' Brasília ', uf: 'df' } });
  assert.deepEqual(result.data, { cidade: 'Brasília', uf: 'DF' });
  result = await request('/me/localizacao', { token, method: 'PUT', body: { cidade: '', uf: '' } });
  assert.deepEqual(result.data, { cidade: '', uf: '' });

  assert.equal((await request('/me/telefone')).status, 401);
  assert.equal((await request('/me/telefone', { method: 'PUT', body: { telefone: '(61) 98888-0000' } })).status, 401);
}

async function createGarden(admin, label) {
  const garden = await request('/hortas', { token: admin.token, method: 'POST', body: {
    nome: `${label} ${suffix}`, descricao: 'Horta de teste do cadastro curto', latitude: -15.79, longitude: -47.88,
    endereco: 'Endereço de teste isolado', cidade: 'Brasília', uf: 'DF', contato: 'horta@example.test',
  } });
  assert.equal(garden.status, 201, JSON.stringify(garden.data));
  return garden.data.id_horta;
}

async function participants(admin, gardenId) {
  const result = await request(`/admin/horta/participantes?id_horta=${gardenId}`, { token: admin.token });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  return result.data;
}

async function joinScenarios() {
  const adminA = await registerMinimal('AdminA');
  const adminB = await registerMinimal('AdminB');
  const gardenA = await createGarden(adminA, 'Cadastro A');
  const gardenB = await createGarden(adminB, 'Cadastro B');

  const withPhone = await registerMinimal('ComFone');
  let result = await request(`/hortas/${gardenA}/entrar`, { token: withPhone.token, method: 'POST', body: { telefone: ' (61) 97777-0000 ' } });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  let listA = await participants(adminA, gardenA);
  assert.equal(listA.find((row) => row.id_usuario === withPhone.user.id).telefone, '(61) 97777-0000');

  // join without telefone keeps existing phone
  result = await request(`/hortas/${gardenB}/entrar`, { token: withPhone.token, method: 'POST' });
  assert.equal(result.status, 200, JSON.stringify(result.data));
  assert.equal((await userRow(withPhone.user.id)).telefone, '(61) 97777-0000');

  const blank = await registerMinimal('Branco');
  result = await request(`/hortas/${gardenA}/entrar`, { token: blank.token, method: 'POST', body: { telefone: '   ' } });
  assert.equal(result.status, 200, JSON.stringify(result.data));

  const invalid = await registerMinimal('Invalido');
  result = await request(`/hortas/${gardenA}/entrar`, { token: invalid.token, method: 'POST', body: { telefone: 'abc' } });
  assert.equal(result.status, 400, JSON.stringify(result.data));
  assert.ok(result.data.error);

  listA = await participants(adminA, gardenA);
  assert.equal(listA.find((row) => row.id_usuario === blank.user.id).telefone, null);
  assert.ok(!listA.some((row) => row.id_usuario === invalid.user.id));

  const listB = await participants(adminB, gardenB);
  assert.deepEqual(listB.map((row) => row.id_usuario), [withPhone.user.id]);
  assert.ok(!listB.some((row) => row.id_usuario === blank.user.id));

  assert.equal((await request(`/admin/horta/participantes?id_horta=${gardenA}`, { token: blank.token })).status, 403);
  assert.equal((await request(`/admin/horta/participantes?id_horta=${gardenA}`, { token: adminB.token })).status, 403);
}

(async () => {
  try {
    const minimal = await registerScenarios();
    await phoneScenarios(minimal);
    await joinScenarios();
    console.log(JSON.stringify({ pass: true, scenarios: [
      'cadastro só com nome, e-mail e senha', 'campos opcionais validados se enviados', 'clientes antigos continuam funcionando',
      'ler, salvar, rejeitar e limpar telefone', 'telefone exige login',
      'telefone opcional ao entrar na horta', 'entrar sem telefone preserva o existente', 'telefone invalido impede a entrada',
      'admins veem só os telefones da própria horta',
    ] }, null, 2));
  } finally {
    await db.end();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
