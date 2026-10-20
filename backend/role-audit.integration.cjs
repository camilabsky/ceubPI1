const assert = require('node:assert/strict');
const mysql = require('mysql2/promise');

const api = 'http://localhost:8082';
const suffix = `${Date.now()}`;
const db = mysql.createPool({ host: '127.0.0.1', port: 3308, user: 'user', password: 'password', database: 'horta' });

async function request(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

async function register(name, gardenName, gardenId) {
  const result = await request('/auth/register', { method: 'POST', body: {
    nome: name, email: `${name.toLowerCase()}-${suffix}@example.test`, senha: 'RoleAudit!123',
    ...(gardenName ? { nome_nova_horta: gardenName, latitude: -15.79, longitude: -47.88, endereco: 'Endereço de teste isolado' } : {}),
    ...(gardenId ? { id_horta: gardenId } : {}),
  } });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  return result.data;
}

async function task(token, gardenId, title) {
  const result = await request(`/admin/tarefas?id_horta=${gardenId}`, { token, method: 'POST', body: {
    id_horta: gardenId, titulo: title, tipo: 'Teste', descricao: 'Tarefa de integração isolada', dificuldade: 0, moedas: 1, xp: 1, tempo: 5,
  } });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  return result.data.id;
}

(async () => {
  try {
    const adminA = await register('AdminA', `Auditoria A ${suffix}`);
    const adminB = await register('AdminB', `Auditoria B ${suffix}`);
    const gardenA = adminA.user.roles[0].id_horta;
    const gardenB = adminB.user.roles[0].id_horta;
    assert.notEqual(gardenA, gardenB);

    let result = await request(`/hortas/${gardenA}/entrar`, { token: adminB.token, method: 'POST' });
    assert.equal(result.status, 200);
    result = await request(`/hortas/${gardenB}/entrar`, { token: adminB.token, method: 'POST' });
    assert.equal(result.status, 200);
    assert.deepEqual(result.data.user.roles.filter((role) => role.id_horta === gardenB).map((role) => role.role).sort(), ['ADMIN', 'MEMBER']);

    const memberA = await register('MemberA', null, gardenA);
    const taskA = await task(adminA.token, gardenA, `Tarefa A ${suffix}`);
    const taskB = await task(adminB.token, gardenB, `Tarefa B ${suffix}`);
    const tasksA = await request(`/tarefas_disponiveis?id_horta=${gardenA}`, { token: adminB.token });
    const tasksB = await request(`/tarefas_disponiveis?id_horta=${gardenB}`, { token: adminB.token });
    assert.equal(tasksA.status, 200);
    assert.equal(tasksB.status, 200);
    assert.ok(tasksA.data.some((item) => item.id === taskA));
    assert.ok(tasksA.data.every((item) => item.id_horta === gardenA));
    assert.ok(tasksB.data.some((item) => item.id === taskB));
    assert.ok(tasksB.data.every((item) => item.id_horta === gardenB));

    assert.equal((await request(`/admin/tarefas?id_horta=${gardenA}`, { token: adminB.token })).status, 403);
    assert.equal((await request(`/admin/tarefas?id_horta=${gardenB}`, { token: memberA.token })).status, 403);
    assert.equal((await request('/admin/tarefas', { token: memberA.token, method: 'POST', body: {
      id_horta: gardenA, titulo: `Não autorizado ${suffix}`, tipo: 'Teste', descricao: 'Operação negada', dificuldade: 0, moedas: 1, xp: 1, tempo: 5,
    } })).status, 403);
    assert.equal((await request(`/tarefas_disponiveis?id_horta=${gardenB}`, { token: memberA.token })).status, 403);
    assert.equal((await request(`/me/gamificacao?id_horta=${gardenB}`, { token: memberA.token })).status, 403);

    // Complete two rows for the same profile in different gardens to verify that
    // the active community leaderboard only counts tasks from its own garden.
    await db.query('UPDATE Tarefas SET id_perfil = ?, concluido = true, status = \'completed\' WHERE id = ?', [adminB.user.id_perfil, taskA]);
    await db.query('UPDATE Tarefas SET id_perfil = ?, concluido = true, status = \'completed\' WHERE id = ?', [adminB.user.id_perfil, taskB]);
    const communityProfile = await request(`/me/gamificacao?id_horta=${gardenB}`, { token: adminB.token });
    assert.equal(communityProfile.status, 200, JSON.stringify(communityProfile.data));
    const selfOnLeaderboard = communityProfile.data.leaderboard.find((member) => member.is_you);
    assert.equal(selfOnLeaderboard.tarefas_concluidas, 1);
    await db.query('UPDATE Tarefas SET id_perfil = NULL, concluido = false, status = \'available\' WHERE id = ?', [taskB]);

    const accepted = await request('/iniciar_tarefa', { token: adminB.token, method: 'POST', body: { id_horta: gardenB, id_tarefa: taskB } });
    assert.equal(accepted.status, 200);
    const leftB = await request(`/hortas/${gardenB}/sair`, { token: adminB.token, method: 'DELETE' });
    assert.equal(leftB.status, 200);
    assert.equal(leftB.data.in_progress_tasks, 1);
    assert.ok(leftB.data.user.roles.some((role) => role.id_horta === gardenB && role.role === 'ADMIN'));
    assert.ok(!leftB.data.user.roles.some((role) => role.id_horta === gardenB && role.role === 'MEMBER'));
    assert.equal((await request(`/hortas/${gardenB}/sair`, { token: adminB.token, method: 'DELETE' })).status, 409);
    assert.equal((await request(`/minhas_tarefas?id_horta=${gardenB}`, { token: adminB.token, method: 'POST' })).status, 403);
    const [preserved] = await db.query('SELECT status, id_perfil, id_horta FROM Tarefas WHERE id = ?', [taskB]);
    assert.equal(preserved[0].status, 'in_progress');
    assert.equal(Number(preserved[0].id_horta), gardenB);

    const leftOnly = await request(`/hortas/${gardenA}/sair`, { token: memberA.token, method: 'DELETE' });
    assert.equal(leftOnly.status, 200);
    assert.equal(leftOnly.data.user.roles.length, 0);
    assert.equal((await request(`/hortas/${gardenA}/sair`, { token: memberA.token, method: 'DELETE' })).status, 409);
    assert.equal((await request(`/admin/tarefas?id_horta=${gardenA}`, { token: memberA.token })).status, 403);

    console.log(JSON.stringify({ gardenA, gardenB, taskA, taskB, pass: true, scenarios: [
      'papéis independentes em hortas distintas', 'dados de tarefas isolados por horta', 'dupla função na mesma horta',
      'permissão administrativa restrita à horta', 'saída preserva administração', 'tarefa em andamento preservada',
      'saída repetida sem inconsistência', 'saída da única horta deixa associação vazia',
    ] }, null, 2));
  } finally {
    await db.end();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
