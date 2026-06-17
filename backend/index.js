const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const pool = mysql.createPool({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'horta',
    port: 3306,
    charset: 'utf8mb4'
});

const db = pool.promise();

app.use(cors({
    origin: ['http://localhost:3000', 'http://0.0.0.0:3000']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function tokenFromHeader(authorizationHeader) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return null;
    }
    return authorizationHeader.slice(7);
}

async function getUserRoles(id_usuario) {
    const [roles] = await db.query(
        `SELECT uhr.papel AS role, uhr.id_horta, h.nome AS horta_nome
         FROM UsuarioHortaRole uhr
         LEFT JOIN Horta h ON h.id = uhr.id_horta
         WHERE uhr.id_usuario = ?`,
        [id_usuario]
    );
    return roles;
}

async function isAdminForHorta(id_usuario, id_horta) {
    const [rows] = await db.query(
        'SELECT 1 FROM UsuarioHortaRole WHERE id_usuario = ? AND id_horta = ? AND papel = "ADMIN" LIMIT 1',
        [id_usuario, id_horta]
    );
    return rows.length > 0;
}

function requireAuth(req, res, next) {
    try {
        const token = tokenFromHeader(req.headers.authorization);
        if (!token) {
            return res.status(401).send({ error: 'Token ausente' });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Token invalido' });
    }
}

async function requireHortaAdmin(req, res, next) {
    try {
        const id_horta = Number(req.body.id_horta || req.query.id_horta);
        if (!Number.isInteger(id_horta) || id_horta <= 0) {
            return res.status(400).send({ error: 'id_horta invalido' });
        }

        const allowed = await isAdminForHorta(req.user.id, id_horta);
        if (!allowed) {
            return res.status(403).send({ error: 'Apenas admin da horta pode executar esta acao' });
        }

        req.id_horta = id_horta;
        next();
    } catch (error) {
        console.error('Erro de autorizacao:', error);
        return res.status(500).send({ error: 'Erro de autorizacao' });
    }
}

app.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).send({ error: 'Email e senha sao obrigatorios' });
        }

        const [users] = await db.query(
            'SELECT id, nome, email, password_hash, ativo, id_perfil FROM Usuario WHERE email = ? LIMIT 1',
            [email]
        );

        if (users.length === 0 || !users[0].ativo) {
            return res.status(401).send({ error: 'Credenciais invalidas' });
        }

        const user = users[0];
        const senhaOk = await bcrypt.compare(senha, user.password_hash);
        if (!senhaOk) {
            return res.status(401).send({ error: 'Credenciais invalidas' });
        }

        const roles = await getUserRoles(user.id);
        const token = jwt.sign(
            { id: user.id, email: user.email, nome: user.nome, id_perfil: user.id_perfil },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.send({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                id_perfil: user.id_perfil,
                roles
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).send({ error: 'Erro no login' });
    }
});

app.get('/auth/me', requireAuth, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, nome, email, id_perfil FROM Usuario WHERE id = ? LIMIT 1',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).send({ error: 'Usuario nao encontrado' });
        }

        const roles = await getUserRoles(req.user.id);
        return res.send({ ...users[0], roles });
    } catch (error) {
        console.error('Erro no /auth/me:', error);
        return res.status(500).send({ error: 'Erro ao carregar usuario' });
    }
});

app.post('/minhas_tarefas', async (req, res) => {
    try {
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query(
            'SELECT * FROM Tarefas WHERE id_perfil = ? AND NOT concluido AND deleted_at IS NULL',
            [id_perfil]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /minhas_tarefas:', error);
        return res.status(500).send({ error: 'Erro ao listar tarefas' });
    }
});

app.post('/tarefas_concluidas', async (req, res) => {
    try {
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query(
            'SELECT count(*) as Total FROM Tarefas WHERE id_perfil = ? AND concluido AND deleted_at IS NULL',
            [id_perfil]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /tarefas_concluidas:', error);
        return res.status(500).send({ error: 'Erro ao contar tarefas concluidas' });
    }
});

app.post('/minhas_moedas', async (req, res) => {
    try {
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query('SELECT Saldo FROM SaldoPerfil WHERE id_perfil = ?', [id_perfil]);
        return res.send(results[0] || { Saldo: 0 });
    } catch (error) {
        console.error('Erro em /minhas_moedas:', error);
        return res.status(500).send({ error: 'Erro ao consultar saldo' });
    }
});

app.post('/minhas_mudas', async (req, res) => {
    try {
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query(
            'SELECT SUM(mudas) AS Total FROM Tarefas WHERE id_perfil = ? AND concluido AND deleted_at IS NULL',
            [id_perfil]
        );
        return res.send(results[0] || { Total: 0 });
    } catch (error) {
        console.error('Erro em /minhas_mudas:', error);
        return res.status(500).send({ error: 'Erro ao consultar mudas' });
    }
});

app.post('/minhas_recompensas', async (req, res) => {
    try {
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query(
            'SELECT COUNT(*) as Total FROM PerfilRecompensas WHERE id_perfil = ?',
            [id_perfil]
        );
        return res.send(results[0] || { Total: 0 });
    } catch (error) {
        console.error('Erro em /minhas_recompensas:', error);
        return res.status(500).send({ error: 'Erro ao consultar recompensas' });
    }
});

app.post('/concluir_tarefa', async (req, res) => {
    try {
        const id_tarefa = Number(req.body.id_tarefa);
        const [results] = await db.query('UPDATE Tarefas SET concluido = true WHERE id = ?', [id_tarefa]);
        return res.send(results);
    } catch (error) {
        console.error('Erro em /concluir_tarefa:', error);
        return res.status(500).send({ error: 'Erro ao concluir tarefa' });
    }
});

app.get('/tarefas_disponiveis', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Tarefas WHERE id_perfil IS NULL AND deleted_at IS NULL');
        return res.send(results);
    } catch (error) {
        console.error('Erro em /tarefas_disponiveis:', error);
        return res.status(500).send({ error: 'Erro ao listar tarefas disponiveis' });
    }
});

app.post('/aceitar_tarefa', async (req, res) => {
    try {
        const id_tarefa = Number(req.body.id_tarefa);
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query('UPDATE Tarefas SET id_perfil = ? WHERE id = ?', [id_perfil, id_tarefa]);
        return res.send(results);
    } catch (error) {
        console.error('Erro em /aceitar_tarefa:', error);
        return res.status(500).send({ error: 'Erro ao aceitar tarefa' });
    }
});

// Endpoint legado (aberto) mantido por compatibilidade temporaria.
app.post('/criar_tarefa', async (req, res) => {
    try {
        const { titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo } = req.body;
        if (!titulo || !tipo || !horta || !descricao) {
            return res.status(400).send({ error: 'Campos obrigatorios ausentes' });
        }

        const dificuldade_num = Number(dificuldade);
        const moedas_num = Number(moedas);
        const mudas_num = Number(mudas);
        const tempo_num = Number(tempo);

        if (
            !Number.isInteger(dificuldade_num) || dificuldade_num < 0 || dificuldade_num > 2 ||
            !Number.isInteger(moedas_num) || moedas_num < 0 ||
            !Number.isInteger(mudas_num) || mudas_num < 0 ||
            !Number.isInteger(tempo_num) || tempo_num <= 0
        ) {
            return res.status(400).send({ error: 'Valores numericos invalidos' });
        }

        const [results] = await db.query(
            'INSERT INTO Tarefas (titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, tipo, horta, descricao, dificuldade_num, moedas_num, mudas_num, tempo_num]
        );

        return res.status(201).send({ id: results.insertId, message: 'Tarefa criada com sucesso' });
    } catch (error) {
        console.error('Erro em /criar_tarefa:', error);
        return res.status(500).send({ error: 'Erro ao criar tarefa' });
    }
});

app.post('/admin/tarefas', requireAuth, requireHortaAdmin, async (req, res) => {
    try {
        const { titulo, tipo, descricao, dificuldade, moedas, mudas, tempo } = req.body;
        if (!titulo || !tipo || !descricao) {
            return res.status(400).send({ error: 'Campos obrigatorios ausentes' });
        }

        const [hortaRows] = await db.query('SELECT nome FROM Horta WHERE id = ? LIMIT 1', [req.id_horta]);
        if (hortaRows.length === 0) {
            return res.status(404).send({ error: 'Horta nao encontrada' });
        }

        const [results] = await db.query(
            `INSERT INTO Tarefas
             (titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo, id_horta, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo,
                tipo,
                hortaRows[0].nome,
                descricao,
                Number(dificuldade) || 0,
                Number(moedas) || 0,
                Number(mudas) || 0,
                Number(tempo) || 1,
                req.id_horta,
                req.user.id
            ]
        );

        return res.status(201).send({ id: results.insertId, message: 'Tarefa criada pelo admin' });
    } catch (error) {
        console.error('Erro em /admin/tarefas:', error);
        return res.status(500).send({ error: 'Erro ao criar tarefa admin' });
    }
});

app.put('/admin/tarefas/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [currentRows] = await db.query('SELECT * FROM Tarefas WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
        if (currentRows.length === 0) {
            return res.status(404).send({ error: 'Tarefa nao encontrada' });
        }

        const current = currentRows[0];
        const canEdit = await isAdminForHorta(req.user.id, current.id_horta);
        if (!canEdit) {
            return res.status(403).send({ error: 'Apenas admin da horta pode editar' });
        }

        const titulo = req.body.titulo ?? current.titulo;
        const tipo = req.body.tipo ?? current.tipo;
        const descricao = req.body.descricao ?? current.descricao;
        const dificuldade = req.body.dificuldade ?? current.dificuldade;
        const moedas = req.body.moedas ?? current.moedas;
        const mudas = req.body.mudas ?? current.mudas;
        const tempo = req.body.tempo ?? current.tempo;

        await db.query(
            `UPDATE Tarefas
             SET titulo = ?, tipo = ?, descricao = ?, dificuldade = ?, moedas = ?, mudas = ?, tempo = ?, updated_at = NOW()
             WHERE id = ?`,
            [titulo, tipo, descricao, dificuldade, moedas, mudas, tempo, id]
        );

        return res.send({ message: 'Tarefa atualizada' });
    } catch (error) {
        console.error('Erro em PUT /admin/tarefas/:id:', error);
        return res.status(500).send({ error: 'Erro ao editar tarefa' });
    }
});

app.delete('/admin/tarefas/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [currentRows] = await db.query('SELECT id_horta FROM Tarefas WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
        if (currentRows.length === 0) {
            return res.status(404).send({ error: 'Tarefa nao encontrada' });
        }

        const canDelete = await isAdminForHorta(req.user.id, currentRows[0].id_horta);
        if (!canDelete) {
            return res.status(403).send({ error: 'Apenas admin da horta pode deletar' });
        }

        await db.query('UPDATE Tarefas SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?', [id]);
        return res.send({ message: 'Tarefa removida' });
    } catch (error) {
        console.error('Erro em DELETE /admin/tarefas/:id:', error);
        return res.status(500).send({ error: 'Erro ao deletar tarefa' });
    }
});

app.get('/recompensas_disponiveis', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM RecompensasDisponiveis');
        return res.send(results);
    } catch (error) {
        console.error('Erro em /recompensas_disponiveis:', error);
        return res.status(500).send({ error: 'Erro ao listar recompensas' });
    }
});

app.get('/recompensas', requireAuth, async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id, nome, descricao, preco, quantidade_disponivel FROM Recompensas WHERE deleted_at IS NULL ORDER BY id DESC'
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /recompensas:', error);
        return res.status(500).send({ error: 'Erro ao listar recompensas' });
    }
});

app.post('/resgatar_recompensa', async (req, res) => {
    try {
        const id_recompensa = Number(req.body.id_recompensa);
        const id_perfil = Number(req.body.id_perfil);
        const [results] = await db.query(
            'UPDATE PerfilRecompensas SET id_perfil = ? WHERE id_perfil IS NULL AND id_recompensa = ? LIMIT 1',
            [id_perfil, id_recompensa]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /resgatar_recompensa:', error);
        return res.status(500).send({ error: 'Erro ao resgatar recompensa' });
    }
});

app.post('/admin/recompensas', requireAuth, requireHortaAdmin, async (req, res) => {
    try {
        const { nome, descricao, tipo, preco, src, quantidade_disponivel } = req.body;
        if (!nome || !descricao || !tipo) {
            return res.status(400).send({ error: 'Campos obrigatorios ausentes' });
        }

        const [results] = await db.query(
            `INSERT INTO Recompensas
             (nome, descricao, tipo, preco, src, quantidade_disponivel, id_horta, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, descricao, tipo, Number(preco) || 0, src || null, Number(quantidade_disponivel) || 0, req.id_horta, req.user.id]
        );

        return res.status(201).send({ id: results.insertId, message: 'Recompensa criada pelo admin' });
    } catch (error) {
        console.error('Erro em /admin/recompensas:', error);
        return res.status(500).send({ error: 'Erro ao criar recompensa admin' });
    }
});

app.put('/admin/recompensas/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [currentRows] = await db.query('SELECT * FROM Recompensas WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
        if (currentRows.length === 0) {
            return res.status(404).send({ error: 'Recompensa nao encontrada' });
        }

        const current = currentRows[0];
        const canEdit = await isAdminForHorta(req.user.id, current.id_horta);
        if (!canEdit) {
            return res.status(403).send({ error: 'Apenas admin da horta pode editar' });
        }

        await db.query(
            `UPDATE Recompensas
             SET nome = ?, descricao = ?, tipo = ?, preco = ?, src = ?, quantidade_disponivel = ?, updated_at = NOW()
             WHERE id = ?`,
            [
                req.body.nome ?? current.nome,
                req.body.descricao ?? current.descricao,
                req.body.tipo ?? current.tipo,
                req.body.preco ?? current.preco,
                req.body.src ?? current.src,
                req.body.quantidade_disponivel ?? current.quantidade_disponivel,
                id
            ]
        );

        return res.send({ message: 'Recompensa atualizada' });
    } catch (error) {
        console.error('Erro em PUT /admin/recompensas/:id:', error);
        return res.status(500).send({ error: 'Erro ao editar recompensa' });
    }
});

app.delete('/admin/recompensas/:id', requireAuth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [currentRows] = await db.query('SELECT id_horta FROM Recompensas WHERE id = ? AND deleted_at IS NULL LIMIT 1', [id]);
        if (currentRows.length === 0) {
            return res.status(404).send({ error: 'Recompensa nao encontrada' });
        }

        const canDelete = await isAdminForHorta(req.user.id, currentRows[0].id_horta);
        if (!canDelete) {
            return res.status(403).send({ error: 'Apenas admin da horta pode deletar' });
        }

        await db.query('UPDATE Recompensas SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?', [id]);
        return res.send({ message: 'Recompensa removida' });
    } catch (error) {
        console.error('Erro em DELETE /admin/recompensas/:id:', error);
        return res.status(500).send({ error: 'Erro ao deletar recompensa' });
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`⚡️[bootup]: Server is running at port: ${port}`);
});
