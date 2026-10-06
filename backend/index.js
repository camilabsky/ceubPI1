require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { ACHIEVEMENTS, getAchievementProgress, getActiveStreak, getLevelInfo, getNextStreak } = require('./gamification');
const { distanceInMeters, isValidCoordinate } = require('./geolocation');
const { GEMINI_MODEL, requestGeminiAnalysis, shouldAutoApprove } = require('./gemini');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET nao definido no .env');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'horta',
  port: Number(process.env.DB_PORT || 3006,),
  waitForConnections: true,
  connectionLimit: 10,
});

const db = pool;
const taskProofDir = path.join(__dirname, 'uploads', 'task-proofs');

app.use(cors({
    origin: ['http://localhost:3000', 'http://0.0.0.0:3000', 'http://localhost:3001', ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : [])]
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
        `SELECT uhr.papel AS role, uhr.id_horta, h.nome AS horta_nome, h.latitude, h.longitude, h.endereco
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
        const id_horta = Number(req.body?.id_horta || req.query.id_horta);
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

app.post('/auth/register', async (req, res) => {
    const { nome, email, senha, id_horta, nome_nova_horta, latitude, longitude, endereco } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send({ error: 'Nome, email e senha sao obrigatorios' });
    }

    if (id_horta && nome_nova_horta) {
        return res.status(400).send({ error: 'Informe apenas id_horta OU nome_nova_horta, nao os dois' });
    }

    let lat, lng;
    if (nome_nova_horta) {
        if (!endereco || !endereco.trim()) {
            return res.status(400).send({ error: 'Endereco da horta e obrigatorio' });
        }
        lat = Number(latitude);
        lng = Number(longitude);
        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            return res.status(400).send({ error: 'Latitude invalida ou nao informada' });
        }
        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            return res.status(400).send({ error: 'Longitude invalida ou nao informada' });
        }
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const senhaHash = await bcrypt.hash(senha, 10);

        const [existing] = await connection.query('SELECT id FROM Usuario WHERE email = ? LIMIT 1', [email]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).send({ error: 'Ja existe um usuario com este email' });
        }

        const [perfilResult] = await connection.query(
            'INSERT INTO Perfil (nome) VALUES (?)',
            [nome.slice(0, 64)]
        );
        const id_perfil = perfilResult.insertId;

        const [userResult] = await connection.query(
            'INSERT INTO Usuario (nome, email, password_hash, id_perfil) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, id_perfil]
        );
        const id_usuario = userResult.insertId;

        let idHortaFinal = id_horta;
        let papel = 'MEMBER';

        if (nome_nova_horta) {
            const [hortaResult] = await connection.query(
                'INSERT INTO Horta (nome, latitude, longitude, endereco) VALUES (?, ?, ?, ?)',
                [nome_nova_horta, lat, lng, endereco.trim()]
            );
            idHortaFinal = hortaResult.insertId;
            papel = 'ADMIN';
        } else if (id_horta) {
            const [hortaRows] = await connection.query('SELECT id FROM Horta WHERE id = ? LIMIT 1', [id_horta]);

            if (hortaRows.length === 0) {
                await connection.rollback();
                return res.status(404).send({ error: 'Horta nao encontrada' });
            }
        }

                if (idHortaFinal) {
            await connection.query(
                'INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel) VALUES (?, ?, ?)',
                [id_usuario, idHortaFinal, papel]
            );
        }

        await connection.commit();

        const roles = await getUserRoles(id_usuario);
        const token = jwt.sign(
            { id: id_usuario, email, nome, id_perfil },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(201).send({
            token,
            user: { id: id_usuario, nome, email, id_perfil, roles }
        });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ error: 'Nome de horta ou email ja cadastrado' });
        }
        console.error('Erro em /auth/register:', error);
        return res.status(500).send({ error: 'Erro ao cadastrar usuario' });
    } finally {
        connection.release();
    }
});

app.post('/auth/google', async (req, res) => {
    if (!googleClient) {
        return res.status(500).send({ error: 'Login com Google nao configurado' });
    }

    const { credential } = req.body;
    if (!credential) {
        return res.status(400).send({ error: 'Credential e obrigatorio' });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const nome = payload.name || email;

        if (!payload.email_verified) {
            return res.status(401).send({ error: 'Email do Google nao verificado' });
        }

        const [existing] = await db.query(
            'SELECT id, nome, email, ativo, id_perfil FROM Usuario WHERE email = ? LIMIT 1',
            [email]
        );

        let user;
        if (existing.length > 0) {
            if (!existing[0].ativo) {
                return res.status(401).send({ error: 'Usuario inativo' });
            }
            user = existing[0];
        } else {
            const conn = await db.getConnection();
            try {
                await conn.beginTransaction();
                const [perfilResult] = await conn.query(
                    'INSERT INTO Perfil (nome) VALUES (?)',
                    [nome.slice(0, 64)]
                );
                const id_perfil = perfilResult.insertId;
                const [result] = await conn.query(
                    'INSERT INTO Usuario (nome, email, password_hash, ativo, id_perfil) VALUES (?, ?, NULL, true, ?)',
                    [nome, email, id_perfil]
                );
                await conn.commit();
                user = { id: result.insertId, nome, email, id_perfil };
            } catch (e) {
                await conn.rollback();
                throw e;
            } finally {
                conn.release();
            }
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
        console.error('Erro no /auth/google:', error);
        return res.status(401).send({ error: 'Token do Google invalido' });
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

app.put('/auth/me', requireAuth, async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (nome !== undefined && !nome.trim()) {
            return res.status(400).send({
                error: 'O nome é obrigatório'
            });
        }

        if (email !== undefined && !email.trim()) {
            return res.status(400).send({
                error: 'O e-mail é obrigatório'
            });
        }

        const [existingEmail] = await db.query(
            'SELECT id FROM Usuario WHERE email = ? AND id <> ? LIMIT 1',
            [email?.trim(), req.user.id]
        );

        if (email !== undefined && existingEmail.length > 0) {
            return res.status(409).send({
                error: 'Este e-mail já está cadastrado'
            });
        }

        const [currentRows] = await db.query(
            'SELECT nome, email FROM Usuario WHERE id = ? LIMIT 1',
            [req.user.id]
        );

        if (currentRows.length === 0) {
            return res.status(404).send({
                error: 'Usuário não encontrado'
            });
        }

        const nomeFinal = nome?.trim() || currentRows[0].nome;
        const emailFinal = email?.trim() || currentRows[0].email;

        await db.query(
            'UPDATE Usuario SET nome = ?, email = ? WHERE id = ?',
            [nomeFinal, emailFinal, req.user.id]
        );

        const [users] = await db.query(
            'SELECT id, nome, email, id_perfil FROM Usuario WHERE id = ? LIMIT 1',
            [req.user.id]
        );

        const roles = await getUserRoles(req.user.id);

        const newToken = jwt.sign(
            {
                id: users[0].id,
                email: users[0].email,
                nome: users[0].nome,
                id_perfil: users[0].id_perfil
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.send({
            token: newToken,
            user: {
                ...users[0],
                roles
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);

        return res.status(500).send({
            error: 'Erro ao atualizar usuário'
        });
    }
}); 

    app.put('/auth/password', requireAuth, async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
            error: 'Preencha a senha atual e a nova senha',
        });
        }

        if (novaSenha.length < 6) {
        return res.status(400).json({
            error: 'A nova senha deve ter pelo menos 6 caracteres',
        });
        }

        const [usuarios] = await pool.query(
        'SELECT password_hash FROM Usuario WHERE id = ?',
        [req.user.id]
        );

        if (usuarios.length === 0) {
        return res.status(404).json({
            error: 'Usuário não encontrado',
        });
        }

        const senhaCorreta = await bcrypt.compare(
        senhaAtual,
        usuarios[0].password_hash
        );

        if (!senhaCorreta) {
        return res.status(401).json({
            error: 'A senha atual está incorreta',
        });
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10);

        await pool.query(
        'UPDATE Usuario SET password_hash = ? WHERE id = ?',
        [senhaHash, req.user.id]
        );

        return res.json({
        message: 'Senha alterada com sucesso',
        });
    } catch (error) {
        console.error('ERRO COMPLETO AO ALTERAR SENHA:', error);

        return res.status(500).json({
            error: error.message || 'Erro interno ao alterar senha',
        });
        }
            });

app.post('/minhas_tarefas', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);
        const [results] = await db.query(
            `SELECT t.*, (t.completion_photo_url IS NOT NULL) AS has_completion_photo
             FROM Tarefas t
             WHERE t.id_perfil = ? AND (
                 (t.concluido = false AND t.status IN ('in_progress', 'pending_review', 'proof_submitted'))
                 OR (t.concluido = true AND t.completion_photo_url IS NOT NULL AND t.completion_ai_status = 'analyzed')
             )
               AND t.deleted_at IS NULL
             ORDER BY t.updated_at DESC, t.id DESC`,
            [id_perfil]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /minhas_tarefas:', error);
        return res.status(500).send({ error: 'Erro ao listar tarefas' });
    }
});

app.post('/tarefas_concluidas', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);
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

app.post('/minhas_moedas', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);
        const [results] = await db.query('SELECT Saldo FROM SaldoPerfil WHERE id_perfil = ?', [id_perfil]);
        return res.send(results[0] || { Saldo: 0 });
    } catch (error) {
        console.error('Erro em /minhas_moedas:', error);
        return res.status(500).send({ error: 'Erro ao consultar saldo' });
    }
});

app.post('/minhas_mudas', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);
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

app.post('/minhas_recompensas', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);
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

app.post('/concluir_tarefa', requireAuth, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const id_tarefa = Number(req.body.id_tarefa);
        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0 || !req.user.id_perfil) {
            return res.status(400).send({ error: 'Tarefa invalida' });
        }

        await conn.beginTransaction();
        const [taskRows] = await conn.query(
            'SELECT * FROM Tarefas WHERE id = ? AND id_perfil = ? AND deleted_at IS NULL LIMIT 1 FOR UPDATE',
            [id_tarefa, req.user.id_perfil]
        );
        if (taskRows.length === 0) {
            await conn.rollback();
            return res.status(403).send({ error: 'Tarefa nao pertence a este usuario ou nao existe' });
        }
        if (taskRows[0].concluido || taskRows[0].status !== 'in_progress'
            || taskRows[0].completion_review_status === 'rejected') {
            await conn.rollback();
            return res.status(409).send({ error: taskRows[0].completion_review_status === 'rejected'
                ? 'Envie uma nova foto de comprovação para tentar novamente'
                : taskRows[0].status === 'pending_review' ? 'Esta tarefa ja aguarda comprovação' : 'A tarefa precisa estar em andamento para ser finalizada' });
        }

        await conn.query(
            `UPDATE Tarefas
             SET status = 'pending_review', completion_review_status = 'pending', completion_review_note = NULL,
                 completion_reviewed_by = NULL, completion_reviewed_at = NULL, completion_submitted_at = NOW(), updated_at = NOW()
             WHERE id = ? AND id_perfil = ? AND status = 'in_progress' AND concluido = false`,
            [id_tarefa, req.user.id_perfil]
        );
        await conn.commit();
        return res.send({
            ok: true,
            status: 'pending_review',
            message: 'Tarefa enviada e aguardando comprovação.',
        });
    } catch (error) {
        await conn.rollback();
        console.error('Erro em /concluir_tarefa:', error);
        return res.status(500).send({ error: 'Erro ao concluir tarefa' });
    } finally {
        conn.release();
    }
});

app.post('/tarefas/:id/comprovacao', requireAuth, express.raw({ type: ['image/webp', 'image/jpeg'], limit: '2mb' }), async (req, res) => {
    const conn = await db.getConnection();
    let savedFilePath = null;
    try {
        const id_tarefa = Number(req.params.id);
        const id_perfil = Number(req.user.id_perfil);
        const mimeType = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0 || !id_perfil) {
            return res.status(400).send({ error: 'Tarefa invalida' });
        }
        if (!Buffer.isBuffer(req.body) || req.body.length === 0 || !['image/webp', 'image/jpeg'].includes(mimeType)) {
            return res.status(400).send({ error: 'Envie uma foto em formato WebP ou JPEG' });
        }
        const hasJpegSignature = req.body.length >= 3 && req.body[0] === 0xff && req.body[1] === 0xd8 && req.body[2] === 0xff;
        const hasWebpSignature = req.body.length >= 12 && req.body.toString('ascii', 0, 4) === 'RIFF' && req.body.toString('ascii', 8, 12) === 'WEBP';
        if ((mimeType === 'image/jpeg' && !hasJpegSignature) || (mimeType === 'image/webp' && !hasWebpSignature)) {
            return res.status(400).send({ error: 'O conteúdo enviado nao corresponde a uma foto JPEG ou WebP valida' });
        }

        await conn.beginTransaction();
        const [taskRows] = await conn.query(
            `SELECT t.id, t.status, t.completion_photo_url, t.completion_review_status,
                    h.latitude AS horta_latitude, h.longitude AS horta_longitude
             FROM Tarefas t JOIN Horta h ON h.id = t.id_horta
             WHERE t.id = ? AND t.id_perfil = ? AND t.concluido = false AND t.deleted_at IS NULL
             LIMIT 1 FOR UPDATE`,
            [id_tarefa, id_perfil]
        );
        if (taskRows.length === 0) {
            await conn.rollback();
            return res.status(404).send({ error: 'Tarefa nao encontrada para este usuario' });
        }
        const isRetryAfterRejection = taskRows[0].status === 'in_progress'
            && taskRows[0].completion_review_status === 'rejected';
        if ((!isRetryAfterRejection && taskRows[0].status !== 'pending_review')
            || (!isRetryAfterRejection && taskRows[0].completion_photo_url)) {
            await conn.rollback();
            return res.status(409).send({ error: 'Esta tarefa nao aguarda uma nova comprovacao' });
        }

        const rawLatitude = req.headers['x-user-latitude'];
        const rawLongitude = req.headers['x-user-longitude'];
        const latitude = rawLatitude == null || rawLatitude === '' ? NaN : Number(rawLatitude);
        const longitude = rawLongitude == null || rawLongitude === '' ? NaN : Number(rawLongitude);
        let locationStatus = 'unavailable';
        let locationDistance = null;
        const hasValidUserCoordinates = isValidCoordinate(latitude, longitude);
        const gardenLatitude = taskRows[0].horta_latitude == null ? NaN : Number(taskRows[0].horta_latitude);
        const gardenLongitude = taskRows[0].horta_longitude == null ? NaN : Number(taskRows[0].horta_longitude);
        const hasValidGardenCoordinates = taskRows[0].horta_latitude != null
            && taskRows[0].horta_longitude != null
            && isValidCoordinate(gardenLatitude, gardenLongitude);
        if (hasValidUserCoordinates) {
            if (!hasValidGardenCoordinates) {
                locationStatus = 'garden_location_missing';
            } else {
                const exactDistance = distanceInMeters(latitude, longitude, gardenLatitude, gardenLongitude);
                locationDistance = Math.round(exactDistance);
                locationStatus = exactDistance <= 100 ? 'validated' : 'outside_radius';
            }
        }

        const extension = mimeType === 'image/webp' ? 'webp' : 'jpg';
        const filename = `${id_tarefa}-${crypto.randomUUID()}.${extension}`;
        savedFilePath = path.join(taskProofDir, filename);
        await fs.mkdir(taskProofDir, { recursive: true });
        await fs.writeFile(savedFilePath, req.body, { flag: 'wx' });
        const photoUrl = filename;
        const previousPhotoFilename = taskRows[0].completion_photo_url
            ? path.basename(taskRows[0].completion_photo_url)
            : null;
        const [updateResult] = await conn.query(
            `UPDATE Tarefas SET completion_photo_url = ?, completion_latitude = ?, completion_longitude = ?,
                    completion_location_status = ?, completion_location_distance_meters = ?,
                    status = 'proof_submitted', completion_review_status = 'pending', completion_review_note = NULL,
                    completion_reviewed_by = NULL, completion_reviewed_at = NULL, completion_submitted_at = NOW(),
                    completion_ai_status = 'not_requested', ai_resultado = NULL, ai_confianca = NULL,
                    ai_justificativa = NULL, ai_modelo = NULL, ai_analisado_em = NULL, updated_at = NOW()
             WHERE id = ? AND id_perfil = ? AND status = ? AND completion_review_status = ?
               AND completion_photo_url <=> ? AND concluido = false`,
            [photoUrl, hasValidUserCoordinates ? latitude : null, hasValidUserCoordinates ? longitude : null,
                locationStatus, locationDistance, id_tarefa, id_perfil,
                isRetryAfterRejection ? 'in_progress' : 'pending_review',
                isRetryAfterRejection ? 'rejected' : 'pending', taskRows[0].completion_photo_url]
        );
        if (updateResult.affectedRows !== 1) {
            await conn.rollback();
            await fs.unlink(savedFilePath).catch(() => {});
            savedFilePath = null;
            return res.status(409).send({ error: 'A comprovacao desta tarefa ja foi enviada' });
        }
        await conn.commit();
        savedFilePath = null;
        if (previousPhotoFilename && previousPhotoFilename !== filename) {
            await fs.unlink(path.join(taskProofDir, previousPhotoFilename)).catch(() => {});
        }

        const aiAnalysis = await analyzeStoredTaskProof(id_tarefa);
        return res.send({
            ok: true,
            status: aiAnalysis.auto_approved ? 'completed' : 'proof_submitted',
            has_completion_photo: true,
            location_validation: { status: locationStatus, distance_meters: locationDistance },
            ai_analysis: aiAnalysis,
        });
    } catch (error) {
        await conn.rollback();
        if (savedFilePath) await fs.unlink(savedFilePath).catch(() => {});
        console.error('Erro ao enviar comprovacao da tarefa:', error);
        return res.status(500).send({ error: 'Nao foi possivel salvar a comprovacao' });
    } finally {
        conn.release();
    }
});

app.get('/minhas_tarefas/:id/localizacao', requireAuth, async (req, res) => {
    try {
        const id_tarefa = Number(req.params.id);
        const [rows] = await db.query(
            `SELECT completion_latitude, completion_longitude, completion_location_status, completion_location_distance_meters,
                    completion_ai_status, completion_review_status, completion_review_note, completion_reviewed_by,
                    ai_resultado, ai_confianca, ai_justificativa, ai_modelo, ai_analisado_em, status
             FROM Tarefas WHERE id = ? AND id_perfil = ?
               AND ((completion_photo_url IS NOT NULL AND status IN ('proof_submitted', 'completed'))
                 OR (status = 'in_progress' AND completion_review_status = 'rejected'))
               AND deleted_at IS NULL LIMIT 1`,
            [id_tarefa, req.user.id_perfil]
        );
        if (!rows.length) return res.status(404).send({ error: 'Localização não encontrada para esta tarefa' });
        const row = rows[0];
        return res.send({
            latitude: row.completion_latitude,
            longitude: row.completion_longitude,
            status: row.completion_location_status,
            distance_meters: row.completion_location_distance_meters,
            ai_status: row.completion_ai_status,
            ai_resultado: row.ai_resultado,
            ai_confianca: row.ai_confianca,
            ai_justificativa: row.ai_justificativa,
            ai_modelo: row.ai_modelo,
            ai_analisado_em: row.ai_analisado_em,
            review_status: row.completion_review_status,
            review_note: row.completion_review_note,
            auto_approved: row.status === 'completed' && row.completion_review_status === 'approved'
                && row.completion_reviewed_by == null && row.ai_resultado === 'COMPATIVEL'
                && Number(row.ai_confianca) >= 0.85 && row.completion_location_status === 'validated',
        });
    } catch (error) {
        console.error('Erro ao consultar localização da tarefa:', error);
        return res.status(500).send({ error: 'Não foi possível consultar a localização' });
    }
});

app.get('/admin/tarefas/:id/localizacao', requireAuth, async (req, res) => {
    try {
        const id_tarefa = Number(req.params.id);
        const [rows] = await db.query(
            `SELECT t.id_horta, t.completion_latitude, t.completion_longitude,
                    t.completion_location_status, t.completion_location_distance_meters,
                    t.completion_ai_status, t.ai_resultado, t.ai_confianca, t.ai_justificativa,
                    t.ai_modelo, t.ai_analisado_em, t.status, t.completion_review_status,
                    t.completion_reviewed_by
             FROM Tarefas t WHERE t.id = ? AND t.status IN ('proof_submitted', 'completed')
               AND t.completion_photo_url IS NOT NULL AND t.deleted_at IS NULL LIMIT 1`,
            [id_tarefa]
        );
        if (!rows.length) return res.status(404).send({ error: 'Localização não encontrada para esta tarefa' });
        if (!await isAdminForHorta(req.user.id, rows[0].id_horta)) {
            return res.status(403).send({ error: 'Apenas o Admin da horta pode consultar esta localização' });
        }
        const row = rows[0];
        return res.send({
            latitude: row.completion_latitude,
            longitude: row.completion_longitude,
            status: row.completion_location_status,
            distance_meters: row.completion_location_distance_meters,
            ai_status: row.completion_ai_status,
            ai_resultado: row.ai_resultado,
            ai_confianca: row.ai_confianca,
            ai_justificativa: row.ai_justificativa,
            ai_modelo: row.ai_modelo,
            ai_analisado_em: row.ai_analisado_em,
            auto_approved: row.status === 'completed' && row.completion_review_status === 'approved'
                && row.completion_reviewed_by == null && row.ai_resultado === 'COMPATIVEL'
                && Number(row.ai_confianca) >= 0.85 && row.completion_location_status === 'validated',
        });
    } catch (error) {
        console.error('Erro ao consultar localização administrativa da tarefa:', error);
        return res.status(500).send({ error: 'Não foi possível consultar a localização' });
    }
});

app.get('/minhas_tarefas/:id/comprovacao', requireAuth, async (req, res) => {
    try {
        const id_tarefa = Number(req.params.id);
        const id_perfil = Number(req.user.id_perfil);
        const [rows] = await db.query(
            `SELECT completion_photo_url FROM Tarefas WHERE id = ? AND id_perfil = ?
             AND status IN ('proof_submitted', 'completed')
             AND deleted_at IS NULL LIMIT 1`,
            [id_tarefa, id_perfil]
        );
        if (!rows.length || !rows[0].completion_photo_url) return res.status(404).send({ error: 'Foto de comprovacao nao encontrada' });
        const filename = path.basename(rows[0].completion_photo_url);
        const filePath = path.join(taskProofDir, filename);
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).send({ error: 'Arquivo de comprovacao nao encontrado' });
        }
        return res.sendFile(filePath);
    } catch (error) {
        console.error('Erro ao consultar comprovacao da tarefa:', error);
        return res.status(500).send({ error: 'Nao foi possivel consultar a comprovacao' });
    }
});

app.get('/tarefas_disponiveis', requireAuth, async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT t.* FROM Tarefas t
             WHERE t.id_perfil IS NULL AND t.status = 'available' AND t.concluido = false AND t.deleted_at IS NULL
               AND t.id_horta IN (SELECT id_horta FROM UsuarioHortaRole WHERE id_usuario = ?)`,
            [req.user.id]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /tarefas_disponiveis:', error);
        return res.status(500).send({ error: 'Erro ao listar tarefas disponiveis' });
    }
});

app.get('/hortas', async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT h.id, h.nome, h.descricao, h.latitude, h.longitude, h.endereco,
                    COUNT(CASE WHEN uhr.papel = 'MEMBER' THEN 1 END) AS participantes
             FROM Horta h
             LEFT JOIN UsuarioHortaRole uhr ON uhr.id_horta = h.id
             GROUP BY h.id, h.nome, h.descricao, h.latitude, h.longitude, h.endereco
             ORDER BY h.nome ASC`
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /hortas:', error);
        return res.status(500).send({ error: 'Erro ao listar hortas' });
    }
});

app.get('/admin/tarefas', requireAuth, async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT t.*
             FROM Tarefas t
             JOIN UsuarioHortaRole uhr ON uhr.id_horta = t.id_horta AND uhr.papel = 'ADMIN'
             WHERE uhr.id_usuario = ? AND t.deleted_at IS NULL
             ORDER BY t.id DESC`,
            [req.user.id]
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em GET /admin/tarefas:', error);
        return res.status(500).send({ error: 'Erro ao listar tarefas administrativas' });
    }
});

app.post(['/iniciar_tarefa', '/aceitar_tarefa'], requireAuth, async (req, res) => {
    try {
                const id_tarefa = Number(req.body.id_tarefa);
        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) {
            return res.status(400).send({ error: 'id_tarefa invalido' });
        }
        if (!req.user.id_perfil) {
            return res.status(403).send({ error: 'Perfil nao encontrado, saia e entre novamente' });
        }
        const [results] = await db.query(
            `UPDATE Tarefas SET id_perfil = ?, status = 'in_progress', updated_at = NOW()
             WHERE id = ? AND id_perfil IS NULL AND status = 'available' AND concluido = false AND deleted_at IS NULL
               AND id_horta IN (SELECT id_horta FROM UsuarioHortaRole WHERE id_usuario = ?)`,
            [req.user.id_perfil, id_tarefa, req.user.id]
        );
        if (results.affectedRows === 0) {
            return res.status(409).send({ error: 'Tarefa indisponivel (ja aceita, inexistente ou de outra horta)' });
        }
        return res.send({ ...results, status: 'in_progress' });
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
        const { titulo, tipo, descricao, dificuldade, moedas, xp, mudas, tempo } = req.body;
        if (!titulo || !tipo || !descricao) {
            return res.status(400).send({ error: 'Campos obrigatorios ausentes' });
        }

        const [hortaRows] = await db.query('SELECT nome FROM Horta WHERE id = ? LIMIT 1', [req.id_horta]);
        if (hortaRows.length === 0) {
            return res.status(404).send({ error: 'Horta nao encontrada' });
        }

        const moedas_num = Number(moedas ?? 0);
        const xp_num = Number(xp ?? 50);
        if (!Number.isInteger(moedas_num) || moedas_num < 0) {
            return res.status(400).send({ error: 'Moedas deve ser um numero inteiro igual ou maior que zero' });
        }
        if (!Number.isInteger(xp_num) || xp_num < 0 || xp_num > 10000) {
            return res.status(400).send({ error: 'XP deve ser um numero inteiro entre 0 e 10000' });
        }

        const [results] = await db.query(
            `INSERT INTO Tarefas
             (titulo, tipo, horta, descricao, dificuldade, moedas, xp, mudas, tempo, id_horta, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                titulo,
                tipo,
                hortaRows[0].nome,
                descricao,
                Number(dificuldade) || 0,
                moedas_num,
                xp_num,
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
        const xp = req.body.xp ?? current.xp ?? 50;
        const mudas = req.body.mudas ?? current.mudas;
        const tempo = req.body.tempo ?? current.tempo;
        const xp_num = Number(xp);
        const moedas_num = Number(moedas);
        if (!Number.isInteger(moedas_num) || moedas_num < 0) {
            return res.status(400).send({ error: 'Moedas deve ser um numero inteiro igual ou maior que zero' });
        }
        if (!Number.isInteger(xp_num) || xp_num < 0 || xp_num > 10000) {
            return res.status(400).send({ error: 'XP deve ser um numero inteiro entre 0 e 10000' });
        }

        await db.query(
            `UPDATE Tarefas
             SET titulo = ?, tipo = ?, descricao = ?, dificuldade = ?, moedas = ?, xp = ?, mudas = ?, tempo = ?, updated_at = NOW()
             WHERE id = ?`,
            [titulo, tipo, descricao, dificuldade, moedas_num, xp_num, mudas, tempo, id]
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
            `SELECT id, nome, descricao, tipo, preco, src, quantidade_disponivel, id_horta
             FROM Recompensas
             WHERE deleted_at IS NULL
             ORDER BY id DESC`
        );
        return res.send(results);
    } catch (error) {
        console.error('Erro em /recompensas:', error);
        return res.status(500).send({ error: 'Erro ao listar recompensas' });
    }
});

app.get('/me/historico', requireAuth, async (req, res) => {
    try {
        const id_perfil = Number(req.user.id_perfil);

        const [tarefasConcluidas] = await db.query(
            `SELECT id, titulo, descricao, tipo, horta, moedas, tempo
             FROM Tarefas
             WHERE id_perfil = ? AND concluido = true
             ORDER BY id DESC
             LIMIT 50`,
            [id_perfil]
        );

        const [recompensasResgatadas] = await db.query(
            `SELECT r.id, r.nome, r.descricao, r.tipo, r.preco, r.src, r.id_horta
             FROM PerfilRecompensas pr
             JOIN Recompensas r ON r.id = pr.id_recompensa
             WHERE pr.id_perfil = ? AND r.deleted_at IS NULL
             ORDER BY r.id DESC
             LIMIT 50`,
            [id_perfil]
        );

        return res.send({
            tarefas_concluidas: tarefasConcluidas,
            recompensas_resgatadas: recompensasResgatadas
        });
    } catch (error) {
        console.error('Erro em /me/historico:', error);
        return res.status(500).send({ error: 'Erro ao carregar historico do usuario' });
    }
});

app.get('/me/gamificacao', requireAuth, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const id_perfil = Number(req.user.id_perfil);
        if (!id_perfil) return res.status(403).send({ error: 'Perfil nao encontrado' });

        await conn.beginTransaction();
        let gamification = await ensureGamificationProfile(conn, id_perfil);
        const [clockRows] = await conn.query("SELECT DATE_FORMAT(CURRENT_DATE(), '%Y-%m-%d') AS today, DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01') AS period_start, LAST_DAY(CURRENT_DATE()) AS period_end, DATE_FORMAT(CURRENT_DATE(), '%Y-%m') AS current_month");
        const today = normalizeSqlDate(clockRows[0]?.today);
        const tasks = await getCompletedTasksForGamification(conn, id_perfil);
        const historicalStreak = streakSummary(tasks.map((task) => task.completed_day));

        if (!gamification.last_activity_date && historicalStreak.distinctDays.length) {
            const lastDay = historicalStreak.distinctDays[historicalStreak.distinctDays.length - 1];
            await conn.query(
                'UPDATE PerfilGamificacao SET streak_days = ?, last_activity_date = ? WHERE id_perfil = ?',
                [historicalStreak.lastRun, lastDay, id_perfil]
            );
            gamification = { ...gamification, streak_days: historicalStreak.lastRun, last_activity_date: lastDay };
        }
        const currentStreak = getActiveStreak(gamification.streak_days, normalizeSqlDate(gamification.last_activity_date), today);
        await awardEligibleAchievements(conn, id_perfil, tasks, currentStreak);

        const [achievementRows] = await conn.query(
            'SELECT achievement_key, xp_awarded, unlocked_at FROM ConquistasPerfil WHERE id_perfil = ?',
            [id_perfil]
        );
        const unlocked = new Map(achievementRows.map((row) => [row.achievement_key, row]));
        const achievements = ACHIEVEMENTS.map((achievement) => {
            const record = unlocked.get(achievement.id);
            return { ...achievement, unlocked: Boolean(record), unlocked_at: record?.unlocked_at ?? null };
        });

        const [gardens] = await conn.query(
            `SELECT h.id, h.nome, uhr.papel,
                    COUNT(DISTINCT t.id) AS tarefas_concluidas,
                    (SELECT COUNT(*) FROM UsuarioHortaRole membros
                     WHERE membros.id_horta = h.id AND membros.papel = 'MEMBER') AS participantes
             FROM UsuarioHortaRole uhr
             JOIN Horta h ON h.id = uhr.id_horta
             LEFT JOIN Tarefas t ON t.id_horta = h.id AND t.id_perfil = ?
                  AND t.concluido = true AND t.deleted_at IS NULL
             WHERE uhr.id_usuario = ?
             GROUP BY h.id, h.nome, uhr.papel
             ORDER BY h.nome ASC`,
            [id_perfil, req.user.id]
        );

        const communityChallenges = [];
        for (const garden of gardens) {
            const goalTasks = Math.max(5, (Number(garden.participantes) || 0) * 2);
            await conn.query(
                `INSERT IGNORE INTO DesafioComunitario (id_horta, period_start, period_end, goal_tasks)
                 VALUES (?, ?, ?, ?)`,
                [garden.id, clockRows[0].period_start, clockRows[0].period_end, goalTasks]
            );
            const [challengeRows] = await conn.query(
                `SELECT d.id, d.id_horta, h.nome, d.period_start, d.period_end, d.goal_tasks, d.completed_at,
                        (SELECT COUNT(*) FROM Tarefas t WHERE t.id_horta = d.id_horta AND t.concluido = true
                         AND DATE(t.completed_at) BETWEEN d.period_start AND d.period_end) AS completed_tasks
                 FROM DesafioComunitario d JOIN Horta h ON h.id = d.id_horta
                 WHERE d.id_horta = ? AND d.period_start = ? LIMIT 1`,
                [garden.id, clockRows[0].period_start]
            );
            if (!challengeRows.length) continue;
            const challenge = challengeRows[0];
            if (!challenge.completed_at && Number(challenge.completed_tasks) >= Number(challenge.goal_tasks)) {
                await conn.query('UPDATE DesafioComunitario SET completed_at = NOW() WHERE id = ? AND completed_at IS NULL', [challenge.id]);
                challenge.completed_at = new Date();
            }
            communityChallenges.push({
                id: challenge.id,
                id_horta: challenge.id_horta,
                nome: challenge.nome,
                starts_at: challenge.period_start,
                ends_at: challenge.period_end,
                goal_tasks: Number(challenge.goal_tasks) || 0,
                completed_tasks: Number(challenge.completed_tasks) || 0,
                completed: Boolean(challenge.completed_at),
            });
        }

        const [leaderboardRows] = await conn.query(
             `SELECT p.id, p.nome, COALESCE(pg.xp_total, 0) AS xp_total,
                    COUNT(DISTINCT t.id) AS tarefas_concluidas
             FROM UsuarioHortaRole member
             JOIN UsuarioHortaRole mine ON mine.id_horta = member.id_horta AND mine.id_usuario = ?
             JOIN Usuario u ON u.id = member.id_usuario AND u.ativo = true
             JOIN Perfil p ON p.id = u.id_perfil
             LEFT JOIN PerfilGamificacao pg ON pg.id_perfil = p.id
             LEFT JOIN Tarefas t ON t.id_perfil = p.id AND t.concluido = true
             WHERE member.papel = 'MEMBER'
             GROUP BY p.id, p.nome, pg.xp_total
             ORDER BY xp_total DESC, tarefas_concluidas DESC, p.nome ASC
             LIMIT 5`,
            [req.user.id]
        );
        const leaderboard = leaderboardRows.map((member, index) => ({
            position: index + 1,
            id_perfil: Number(member.id),
            nome: member.nome,
            xp: Math.max(0, Number(member.xp_total) || 0),
            tarefas_concluidas: Number(member.tarefas_concluidas) || 0,
            is_you: Number(member.id) === id_perfil,
        }));

        const [resgates] = await conn.query(
            `SELECT pr.id_recompensa, r.nome, pr.redeemed_at,
                    GREATEST(0, COALESCE(pr.redeemed_price, r.preco, 0)) AS preco
             FROM PerfilRecompensas pr
             JOIN Recompensas r ON r.id = pr.id_recompensa
             WHERE pr.id_perfil = ?
             ORDER BY pr.redeemed_at ASC, pr.id_recompensa ASC`,
            [id_perfil]
        );
        const [balanceRows] = await conn.query('SELECT GREATEST(0, COALESCE(Saldo, 0)) AS Saldo FROM SaldoPerfil WHERE id_perfil = ?', [id_perfil]);
        const [profileRows] = await conn.query('SELECT xp_total, streak_days, last_activity_date FROM PerfilGamificacao WHERE id_perfil = ?', [id_perfil]);
        const profileGamification = profileRows[0] || { xp_total: 0, streak_days: 0, last_activity_date: null };
        const levelInfo = getLevelInfo(profileGamification.xp_total);
        const mudasPlantadas = tasks.reduce((total, task) => total + Math.max(0, Number(task.mudas) || 0), 0);
        const mudasEsteMes = tasks.reduce((total, task) => total + (task.completed_month === clockRows[0].current_month ? Math.max(0, Number(task.mudas) || 0) : 0), 0);
        const events = [
            ...tasks.map((task) => ({ id: `task-${task.id}`, kind: 'task', title: 'Tarefa concluída', description: task.titulo, xp: Number(task.xp) || 0, coins: Number(task.moedas) || 0, occurred_at: task.completed_at })),
            ...resgates.map((reward, index) => ({ id: `reward-${reward.id_recompensa}-${index}`, kind: 'reward', title: 'Recompensa resgatada', description: reward.nome, xp: 0, coins: -(Number(reward.preco) || 0), occurred_at: reward.redeemed_at })),
            ...achievements.filter((achievement) => achievement.unlocked).map((achievement) => ({
                id: `achievement-${achievement.id}`, kind: 'achievement', title: 'Conquista desbloqueada', description: achievement.name,
                xp: Number(unlocked.get(achievement.id)?.xp_awarded) || achievement.xp, coins: 0, occurred_at: achievement.unlocked_at,
            })),
        ].sort((a, b) => {
            if (!a.occurred_at && !b.occurred_at) return 0;
            if (!a.occurred_at) return 1;
            if (!b.occurred_at) return -1;
            return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime();
        });

        await conn.commit();
        return res.send({
            ...levelInfo,
            level_names: ['Semente', 'Broto', 'Muda', 'Cultivador', 'Jardineiro', 'Guardião'],
            moedas: Math.max(0, Number(balanceRows[0]?.Saldo) || 0),
            tarefas_concluidas: tasks.length,
            mudas_plantadas: mudasPlantadas,
            mudas_este_mes: mudasEsteMes,
            sequencia_dias: currentStreak,
            achievements,
            events,
            hortas: gardens,
            community_challenges: communityChallenges,
            leaderboard,
            impact: { tasks_completed: tasks.length, gardens_count: gardens.length, seedlings_planted: mudasPlantadas },
        });
    } catch (error) {
        await conn.rollback();
        console.error('Erro em /me/gamificacao:', error);
        return res.status(500).send({ error: 'Erro ao carregar gamificacao do usuario' });
    } finally {
        conn.release();
    }
});

app.get('/admin/horta/historico', requireAuth, requireHortaAdmin, async (req, res) => {
    try {
        const [tarefasConcluidas] = await db.query(
            `SELECT t.id, t.titulo, t.tipo, t.horta, COALESCE(t.moedas_recebidas, t.moedas) AS moedas, COALESCE(t.xp_recebido, t.xp) AS xp, t.tempo, t.completed_at, p.nome AS perfil_nome
             FROM Tarefas t
             LEFT JOIN Perfil p ON p.id = t.id_perfil
             WHERE t.id_horta = ? AND t.concluido = true AND t.deleted_at IS NULL
             ORDER BY t.completed_at DESC, t.id DESC
             LIMIT 100`,
            [req.id_horta]
        );

        const [recompensasResgatadas] = await db.query(
            `SELECT r.id, r.nome, r.tipo, r.preco, pr.redeemed_at, p.nome AS perfil_nome
             FROM PerfilRecompensas pr
             JOIN Recompensas r ON r.id = pr.id_recompensa
             LEFT JOIN Perfil p ON p.id = pr.id_perfil
             WHERE r.id_horta = ? AND pr.id_perfil IS NOT NULL AND r.deleted_at IS NULL
             ORDER BY pr.redeemed_at DESC, r.id DESC
             LIMIT 100`,
            [req.id_horta]
        );

        const [desafiosComunitarios] = await db.query(
            `SELECT d.id, d.goal_tasks, d.period_start, d.period_end, d.completed_at,
                    (SELECT COUNT(*) FROM Tarefas t
                     WHERE t.id_horta = d.id_horta AND t.concluido = true AND t.deleted_at IS NULL
                       AND DATE(t.completed_at) BETWEEN d.period_start AND d.period_end) AS completed_tasks
             FROM DesafioComunitario d
             WHERE d.id_horta = ? AND d.period_start = DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
             LIMIT 1`,
            [req.id_horta]
        );

        return res.send({
            tarefas_concluidas_horta: tarefasConcluidas,
            recompensas_resgatadas_horta: recompensasResgatadas,
            desafio_comunitario: desafiosComunitarios[0] || null,
        });
    } catch (error) {
        console.error('Erro em /admin/horta/historico:', error);
        return res.status(500).send({ error: 'Erro ao carregar historico da horta' });
    }
});

app.post('/hortas', requireAuth, async (req, res) => {
    const { nome, descricao, latitude, longitude, endereco } = req.body;

    if (!nome || !nome.trim()) {
        return res.status(400).send({ error: 'Nome da horta e obrigatorio' });
    }
    if (nome.trim().length > 128) {
        return res.status(400).send({ error: 'Nome da horta deve ter no maximo 128 caracteres' });
    }
    if (descricao && descricao.length > 255) {
        return res.status(400).send({ error: 'Descricao deve ter no maximo 255 caracteres' });
    }
    if (!endereco || !endereco.trim()) {
        return res.status(400).send({ error: 'Endereco da horta e obrigatorio' });
    }

    const lat = latitude === '' || latitude == null ? NaN : Number(latitude);
    const lng = longitude === '' || longitude == null ? NaN : Number(longitude);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).send({ error: 'Latitude invalida ou nao informada' });
    }
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).send({ error: 'Longitude invalida ou nao informada' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [hortaResult] = await connection.query(
            'INSERT INTO Horta (nome, descricao, latitude, longitude, endereco) VALUES (?, ?, ?, ?, ?)',
            [nome.trim(), descricao && descricao.trim() ? descricao.trim() : null, lat, lng, endereco.trim()]
        );
        const id_horta = hortaResult.insertId;

        await connection.query(
            'INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel) VALUES (?, ?, ?)',
            [req.user.id, id_horta, 'ADMIN']
        );

        await connection.commit();

        const roles = await getUserRoles(req.user.id);
        return res.status(201).send({
            id_horta,
            user: { id: req.user.id, nome: req.user.nome, email: req.user.email, id_perfil: req.user.id_perfil ?? null, roles }
        });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ error: 'Ja existe uma horta com este nome' });
        }
        console.error('Erro em POST /hortas:', error);
        return res.status(500).send({ error: 'Erro ao criar horta' });
    } finally {
        connection.release();
    }
});

app.post('/hortas/:id/entrar', requireAuth, async (req, res) => {
    const id_horta = Number(req.params.id);
    if (!Number.isInteger(id_horta) || id_horta <= 0) {
        return res.status(400).send({ error: 'Horta invalida' });
    }

    try {
        const [hortaRows] = await db.query('SELECT id FROM Horta WHERE id = ? LIMIT 1', [id_horta]);
        if (hortaRows.length === 0) {
            return res.status(404).send({ error: 'Horta nao encontrada' });
        }

        const [existing] = await db.query(
            'SELECT 1 FROM UsuarioHortaRole WHERE id_usuario = ? AND id_horta = ? LIMIT 1',
            [req.user.id, id_horta]
        );
        if (existing.length === 0) {
            await db.query(
                'INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel) VALUES (?, ?, ?)',
                [req.user.id, id_horta, 'MEMBER']
            );
        }

        const roles = await getUserRoles(req.user.id);
        return res.status(200).send({
            id_horta,
            user: { id: req.user.id, nome: req.user.nome, email: req.user.email, id_perfil: req.user.id_perfil ?? null, roles }
        });
    } catch (error) {
        console.error('Erro em POST /hortas/:id/entrar:', error);
        return res.status(500).send({ error: 'Erro ao entrar na horta' });
    }
});

app.post('/resgatar_recompensa', requireAuth, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const id_perfil = req.user.id_perfil;
        const id_recompensa = Number(req.body.id_recompensa);

        if (!Number.isInteger(id_recompensa) || id_recompensa <= 0) {
            return res.status(400).send({ error: 'id_recompensa invalido' });
        }

        await conn.beginTransaction();
        await ensureGamificationProfile(conn, id_perfil);

        const [recompensas] = await conn.query(
            'SELECT preco FROM Recompensas WHERE id = ? AND deleted_at IS NULL LIMIT 1 FOR UPDATE',
            [id_recompensa]
        );
        if (recompensas.length === 0 || recompensas[0].preco === null) {
            await conn.rollback();
            return res.status(404).send({ error: 'Recompensa nao encontrada ou invalida' });
        }
        const preco = Number(recompensas[0].preco);
        if (!Number.isInteger(preco) || preco < 0) {
            await conn.rollback();
            return res.status(400).send({ error: 'O custo da recompensa deve ser um numero inteiro igual ou maior que zero' });
        }

        const [saldos] = await conn.query(
            'SELECT Saldo FROM SaldoPerfil WHERE id_perfil = ?',
            [id_perfil]
        );
        const saldo = Math.max(0, Number(saldos[0]?.Saldo) || 0);
        if (saldo < preco) {
            await conn.rollback();
            return res.status(402).send({ error: 'Saldo insuficiente' });
        }

        const [results] = await conn.query(
            'UPDATE PerfilRecompensas SET id_perfil = ?, redeemed_at = NOW(), redeemed_price = ? WHERE id_perfil IS NULL AND id_recompensa = ? LIMIT 1',
            [id_perfil, preco, id_recompensa]
        );
        if (results.affectedRows === 0) {
            await conn.rollback();
            return res.status(409).send({ error: 'Sem estoque disponivel' });
        }

        await conn.commit();
        return res.send({ ok: true, saldo_restante: saldo - preco });
    } catch (error) {
        await conn.rollback();
        console.error('Erro em /resgatar_recompensa:', error);
        return res.status(500).send({ error: 'Erro ao resgatar recompensa' });
    } finally {
        conn.release();
    }
});

app.post('/admin/recompensas', requireAuth, requireHortaAdmin, async (req, res) => {
    try {
        const { nome, descricao, tipo, preco, src, quantidade_disponivel } = req.body;
        if (!nome || !descricao || !tipo) {
            return res.status(400).send({ error: 'Campos obrigatorios ausentes' });
        }
        const preco_num = Number(preco);
        const quantidade_num = Number(quantidade_disponivel);
        if (!Number.isInteger(preco_num) || preco_num < 0 || !Number.isInteger(quantidade_num) || quantidade_num < 0) {
            return res.status(400).send({ error: 'Preco e quantidade devem ser numeros inteiros iguais ou maiores que zero' });
        }

        const [results] = await db.query(
            `INSERT INTO Recompensas
             (nome, descricao, tipo, preco, src, quantidade_disponivel, id_horta, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, descricao, tipo, preco_num, src || null, quantidade_num, req.id_horta, req.user.id]
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

        const preco_num = Number(req.body.preco ?? current.preco);
        const quantidade_num = Number(req.body.quantidade_disponivel ?? current.quantidade_disponivel);
        if (!Number.isInteger(preco_num) || preco_num < 0 || !Number.isInteger(quantidade_num) || quantidade_num < 0) {
            return res.status(400).send({ error: 'Preco e quantidade devem ser numeros inteiros iguais ou maiores que zero' });
        }

        await db.query(
            `UPDATE Recompensas
             SET nome = ?, descricao = ?, tipo = ?, preco = ?, src = ?, quantidade_disponivel = ?, updated_at = NOW()
             WHERE id = ?`,
            [
                req.body.nome ?? current.nome,
                req.body.descricao ?? current.descricao,
                req.body.tipo ?? current.tipo,
                preco_num,
                req.body.src ?? current.src,
                quantidade_num,
                id
            ]
        );

        return res.send({ message: 'Recompensa atualizada' });
    } catch (error) {
        console.error('Erro em PUT /admin/recompensas/:id:', error);
        return res.status(500).send({ error: 'Erro ao editar recompensa' });
    }
});

app.put('/admin/horta', requireAuth, requireHortaAdmin, async (req, res) => {
    try {
        const { latitude, longitude, endereco } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).send({ error: 'Latitude e longitude sao obrigatorias' });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || lat < -90 || lat > 90) {
            return res.status(400).send({ error: 'Latitude invalida' });
        }
        if (Number.isNaN(lng) || lng < -180 || lng > 180) {
            return res.status(400).send({ error: 'Longitude invalida' });
        }

        await db.query(
            'UPDATE Horta SET latitude = ?, longitude = ?, endereco = ? WHERE id = ?',
            [lat, lng, endereco || null, req.id_horta]
        );

        return res.send({ message: 'Localizacao da horta atualizada', latitude: lat, longitude: lng, endereco });
    } catch (error) {
        console.error('Erro em PUT /admin/horta:', error);
        return res.status(500).send({ error: 'Erro ao atualizar localizacao da horta' });
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

async function ensureGamificationSchema() {
    const [statusColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'status'");
    if (statusColumns.length === 0) {
        await db.query('ALTER TABLE Tarefas ADD COLUMN status varchar(24) NULL');
        await db.query(`UPDATE Tarefas SET status = CASE
            WHEN concluido = true THEN 'completed'
            WHEN id_perfil IS NOT NULL THEN 'in_progress'
            ELSE 'available' END`);
        await db.query("ALTER TABLE Tarefas MODIFY COLUMN status varchar(24) NOT NULL DEFAULT 'available'");
    }
    const [submittedColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'completion_submitted_at'");
    if (submittedColumns.length === 0) await db.query('ALTER TABLE Tarefas ADD COLUMN completion_submitted_at datetime NULL');
    const [earnedCoinsColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'moedas_recebidas'");
    if (earnedCoinsColumns.length === 0) await db.query('ALTER TABLE Tarefas ADD COLUMN moedas_recebidas int NULL');
    const [xpColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'xp'");
    if (xpColumns.length === 0) await db.query('ALTER TABLE Tarefas ADD COLUMN xp int NOT NULL DEFAULT 50');
    const [xpReceivedColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'xp_recebido'");
    if (xpReceivedColumns.length === 0) await db.query('ALTER TABLE Tarefas ADD COLUMN xp_recebido int NULL');
    const [taskColumns] = await db.query("SHOW COLUMNS FROM Tarefas LIKE 'completed_at'");
    if (taskColumns.length === 0) await db.query('ALTER TABLE Tarefas ADD COLUMN completed_at datetime NULL');
    const [rewardColumns] = await db.query("SHOW COLUMNS FROM PerfilRecompensas LIKE 'redeemed_at'");
    if (rewardColumns.length === 0) await db.query('ALTER TABLE PerfilRecompensas ADD COLUMN redeemed_at datetime NULL');
    const [priceColumns] = await db.query("SHOW COLUMNS FROM PerfilRecompensas LIKE 'redeemed_price'");
    if (priceColumns.length === 0) await db.query('ALTER TABLE PerfilRecompensas ADD COLUMN redeemed_price int NULL');
    const completionColumns = [
        ['completion_photo_url', 'varchar(512) NULL'],
        ['completion_latitude', 'DECIMAL(10, 8) NULL'],
        ['completion_longitude', 'DECIMAL(11, 8) NULL'],
        ['completion_location_status', "varchar(32) NOT NULL DEFAULT 'not_requested'"],
        ['completion_location_distance_meters', 'int NULL'],
        ['completion_review_status', "varchar(24) NOT NULL DEFAULT 'approved'"],
        ['completion_ai_status', "varchar(24) NOT NULL DEFAULT 'not_requested'"],
        ['ai_resultado', 'varchar(24) NULL'],
        ['ai_confianca', 'decimal(4,3) NULL'],
        ['ai_justificativa', 'varchar(512) NULL'],
        ['ai_modelo', 'varchar(64) NULL'],
        ['ai_analisado_em', 'datetime NULL'],
        ['completion_review_note', 'varchar(512) NULL'],
        ['completion_reviewed_by', 'int NULL'],
        ['completion_reviewed_at', 'datetime NULL'],
    ];
    for (const [column, definition] of completionColumns) {
        const [columns] = await db.query('SHOW COLUMNS FROM Tarefas LIKE ?', [column]);
        if (columns.length === 0) await db.query(`ALTER TABLE Tarefas ADD COLUMN ${column} ${definition}`);
    }
    await db.query(`CREATE TABLE IF NOT EXISTS TarefaComprovacaoHistorico (
        id int AUTO_INCREMENT PRIMARY KEY,
        id_tarefa int NOT NULL,
        id_perfil int NOT NULL,
        foto_url varchar(512) NOT NULL,
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL,
        localizacao_status varchar(32) NULL,
        distancia_metros int NULL,
        ai_status varchar(24) NULL,
        ai_resultado varchar(24) NULL,
        ai_confianca decimal(4,3) NULL,
        ai_justificativa varchar(512) NULL,
        ai_modelo varchar(64) NULL,
        ai_analisado_em datetime NULL,
        motivo_reprovacao varchar(512) NOT NULL,
        revisado_por int NOT NULL,
        enviado_em datetime NULL,
        rejeitado_em datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_comprovacao_historico_tarefa (id_tarefa, id)
    )`);
    await db.query(`UPDATE Tarefas SET status = CASE
        WHEN concluido = true THEN 'completed'
        WHEN completion_review_status = 'pending' THEN 'pending_review'
        WHEN id_perfil IS NOT NULL THEN 'in_progress'
        ELSE 'available' END
        WHERE status = 'available' AND (concluido = true OR id_perfil IS NOT NULL OR completion_review_status = 'pending')`);
    await db.query(`CREATE TABLE IF NOT EXISTS PerfilGamificacao (
        id_perfil int PRIMARY KEY,
        xp_total int NOT NULL DEFAULT 0,
        streak_days int NOT NULL DEFAULT 0,
        last_activity_date date NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_gamificacao_perfil FOREIGN KEY (id_perfil) REFERENCES Perfil(id)
    )`);
    await db.query(`CREATE TABLE IF NOT EXISTS ConquistasPerfil (
        id int AUTO_INCREMENT PRIMARY KEY,
        id_perfil int NOT NULL,
        achievement_key varchar(48) NOT NULL,
        xp_awarded int NOT NULL DEFAULT 0,
        unlocked_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_perfil_conquista (id_perfil, achievement_key),
        CONSTRAINT fk_conquista_perfil FOREIGN KEY (id_perfil) REFERENCES Perfil(id)
    )`);
    await db.query(`CREATE TABLE IF NOT EXISTS DesafioComunitario (
        id int AUTO_INCREMENT PRIMARY KEY,
        id_horta int NOT NULL,
        period_start date NOT NULL,
        period_end date NOT NULL,
        goal_tasks int NOT NULL,
        completed_at datetime NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_horta_desafio_periodo (id_horta, period_start),
        CONSTRAINT fk_desafio_horta FOREIGN KEY (id_horta) REFERENCES Horta(id)
    )`);
    await db.query(`UPDATE Tarefas
                    SET xp = GREATEST(0, COALESCE(xp, 0)),
                        moedas = GREATEST(0, COALESCE(moedas, 0)),
                        xp_recebido = GREATEST(0, COALESCE(xp_recebido, xp, 0)),
                        moedas_recebidas = GREATEST(0, COALESCE(moedas_recebidas, moedas, 0))
                    WHERE concluido = true OR xp < 0 OR moedas < 0`);
    await db.query('UPDATE Recompensas SET preco = 0 WHERE preco < 0');
    await db.query('UPDATE PerfilRecompensas SET redeemed_price = 0 WHERE redeemed_price < 0');
    await db.query(`INSERT IGNORE INTO PerfilGamificacao (id_perfil, xp_total)
        SELECT p.id, COALESCE((SELECT SUM(GREATEST(0, COALESCE(t.xp_recebido, t.xp, 0)))
            FROM Tarefas t WHERE t.id_perfil = p.id AND t.concluido = true), 0)
        FROM Perfil p`);
    await db.query(`CREATE OR REPLACE VIEW SaldoPerfil AS
        SELECT GREATEST(0, COALESCE(t.total_moedas, 0) - COALESCE(r.total_gasto, 0)) AS Saldo, p.id AS id_perfil
        FROM Perfil p
        LEFT JOIN (
            SELECT id_perfil, SUM(COALESCE(moedas_recebidas, moedas)) AS total_moedas
            FROM Tarefas
            WHERE concluido
            GROUP BY id_perfil
        ) t ON p.id = t.id_perfil
        LEFT JOIN (
            SELECT pr.id_perfil, SUM(COALESCE(pr.redeemed_price, rec.preco)) AS total_gasto
            FROM PerfilRecompensas pr
            JOIN Recompensas rec ON pr.id_recompensa = rec.id
            GROUP BY pr.id_perfil
        ) r ON p.id = r.id_perfil`);
}

function normalizeSqlDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value).slice(0, 10);
}

function streakSummary(days) {
    const distinctDays = [...new Set(days.filter(Boolean).map(normalizeSqlDate))].sort();
    let longest = 0;
    let current = 0;
    let previous = null;
    let fiveDayUnlock = null;
    for (const day of distinctDays) {
        current = previous ? getNextStreak(current, previous, day) : 1;
        longest = Math.max(longest, current);
        if (current >= 5 && !fiveDayUnlock) fiveDayUnlock = day;
        previous = day;
    }
    return { distinctDays, longest, lastRun: current, fiveDayUnlock };
}

async function ensureGamificationProfile(conn, idPerfil) {
    let [rows] = await conn.query('SELECT * FROM PerfilGamificacao WHERE id_perfil = ? LIMIT 1 FOR UPDATE', [idPerfil]);
    if (rows.length === 0) {
        const [xpRows] = await conn.query(
            `SELECT COALESCE(SUM(GREATEST(0, COALESCE(xp_recebido, xp, 0))), 0) AS total_xp
             FROM Tarefas WHERE id_perfil = ? AND concluido = true`,
            [idPerfil]
        );
        await conn.query('INSERT IGNORE INTO PerfilGamificacao (id_perfil, xp_total) VALUES (?, ?)', [idPerfil, xpRows[0]?.total_xp || 0]);
        [rows] = await conn.query('SELECT * FROM PerfilGamificacao WHERE id_perfil = ? LIMIT 1 FOR UPDATE', [idPerfil]);
    }
    return rows[0];
}

async function getCompletedTasksForGamification(conn, idPerfil) {
    const [tasks] = await conn.query(
        `SELECT id, titulo, id_horta, GREATEST(0, COALESCE(xp_recebido, xp, 0)) AS xp,
                GREATEST(0, COALESCE(moedas_recebidas, moedas, 0)) AS moedas,
                GREATEST(0, COALESCE(mudas, 0)) AS mudas, completed_at,
                DATE_FORMAT(completed_at, '%Y-%m-%d') AS completed_day,
                DATE_FORMAT(completed_at, '%Y-%m') AS completed_month
         FROM Tarefas WHERE id_perfil = ? AND concluido = true
         ORDER BY completed_at ASC, id ASC`,
        [idPerfil]
    );
    return tasks;
}

async function awardEligibleAchievements(conn, idPerfil, tasks, currentStreak) {
    const days = streakSummary(tasks.map((task) => task.completed_day));
    const unlockedByProgress = getAchievementProgress(tasks, Math.max(days.longest, currentStreak));
    const unlockDates = {
        'first-task': tasks[0]?.completed_at ?? null,
        'ten-tasks': tasks[9]?.completed_at ?? null,
        'five-day-streak': days.fiveDayUnlock,
    };
    const gardenCounts = new Map();
    for (const task of tasks) {
        if (task.id_horta == null) continue;
        const gardenId = Number(task.id_horta);
        const count = (gardenCounts.get(gardenId) || 0) + 1;
        gardenCounts.set(gardenId, count);
        if (count === 20 && !unlockDates['garden-guardian']) unlockDates['garden-guardian'] = task.completed_at;
    }

    const newlyUnlocked = [];
    for (const achievement of ACHIEVEMENTS) {
        if (!unlockedByProgress[achievement.id]) continue;
        const [result] = await conn.query(
            'INSERT IGNORE INTO ConquistasPerfil (id_perfil, achievement_key, xp_awarded, unlocked_at) VALUES (?, ?, ?, COALESCE(?, NOW()))',
            [idPerfil, achievement.id, achievement.xp, unlockDates[achievement.id] || null]
        );
        if (result.affectedRows > 0) {
            await conn.query('UPDATE PerfilGamificacao SET xp_total = GREATEST(0, xp_total + ?) WHERE id_perfil = ?', [achievement.xp, idPerfil]);
            newlyUnlocked.push(achievement);
        }
    }
    return newlyUnlocked;
}

async function approveCompletionInTransaction(conn, task, reviewerId) {
    if (task.concluido || task.status !== 'proof_submitted' || !task.completion_photo_url) {
        throw Object.assign(new Error('A comprovação já foi analisada ou não está pronta para análise'), { statusCode: 409 });
    }
    const id_tarefa = Number(task.id);
    const id_perfil = Number(task.id_perfil);
    const xp = Math.max(0, Math.floor(Number(task.xp) || 0));
    const moedas = Math.max(0, Math.floor(Number(task.moedas) || 0));
    await ensureGamificationProfile(conn, id_perfil);
    const [updateResult] = await conn.query(
        `UPDATE Tarefas
         SET concluido = true, status = 'completed', xp_recebido = ?, moedas_recebidas = ?, completed_at = NOW(),
             completion_review_status = 'approved', completion_review_note = NULL,
             completion_reviewed_by = ?, completion_reviewed_at = NOW(), updated_at = NOW()
         WHERE id = ? AND status = 'proof_submitted' AND concluido = false AND completion_photo_url IS NOT NULL`,
        [xp, moedas, reviewerId, id_tarefa]
    );
    if (updateResult.affectedRows !== 1) {
        throw Object.assign(new Error('A comprovação já foi analisada'), { statusCode: 409 });
    }

    const tasks = await getCompletedTasksForGamification(conn, id_perfil);
    const streak = streakSummary(tasks.map((item) => item.completed_day));
    const lastActivityDate = streak.distinctDays.at(-1) || null;
    await conn.query(
        `UPDATE PerfilGamificacao
         SET xp_total = GREATEST(0, xp_total + ?), streak_days = ?, last_activity_date = ?
         WHERE id_perfil = ?`,
        [xp, streak.lastRun, lastActivityDate, id_perfil]
    );
    const achievements = await awardEligibleAchievements(conn, id_perfil, tasks, streak.lastRun);
    return { ok: true, status: 'completed', xp, moedas, achievements_unlocked: achievements.map((item) => item.id) };
}

async function recordUnavailableAiAnalysis(taskId) {
    try {
        await db.query(
            `UPDATE Tarefas SET completion_ai_status = 'unavailable', ai_resultado = NULL, ai_confianca = NULL,
                    ai_justificativa = ?, ai_modelo = ?, ai_analisado_em = NOW(), updated_at = NOW()
             WHERE id = ? AND status = 'proof_submitted' AND concluido = false`,
            ['Análise automática indisponível no momento. A comprovação aguarda análise do responsável.', GEMINI_MODEL, taskId]
        );
    } catch (error) {
        console.error('Não foi possível registrar a indisponibilidade da análise Gemini:', error.message);
    }
    return {
        status: 'unavailable', resultado: null, confianca: null,
        justificativa: 'Análise automática indisponível no momento. A comprovação aguarda análise do responsável.',
        modelo: GEMINI_MODEL, analisado_em: new Date().toISOString(), auto_approved: false,
    };
}

async function analyzeStoredTaskProof(taskId) {
    let task;
    try {
        const [rows] = await db.query(
            `SELECT id, titulo, status, completion_photo_url, completion_location_status
             FROM Tarefas WHERE id = ? AND status = 'proof_submitted' AND concluido = false
               AND completion_photo_url IS NOT NULL AND deleted_at IS NULL LIMIT 1`,
            [taskId]
        );
        if (!rows.length) throw new Error('Comprovação não está disponível para análise');
        task = rows[0];
        const filename = path.basename(task.completion_photo_url);
        const image = await fs.readFile(path.join(taskProofDir, filename));
        const extension = path.extname(filename).toLowerCase();
        const mimeType = extension === '.webp' ? 'image/webp' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : null;
        if (!mimeType) throw new Error('Formato da foto de comprovação inválido para análise');
        const analysis = await requestGeminiAnalysis({ taskTitle: task.titulo, image, mimeType });

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [lockedRows] = await conn.query(
                'SELECT * FROM Tarefas WHERE id = ? AND deleted_at IS NULL LIMIT 1 FOR UPDATE',
                [taskId]
            );
            if (!lockedRows.length || !lockedRows[0].completion_photo_url
                || !['proof_submitted', 'completed'].includes(lockedRows[0].status)) {
                await conn.rollback();
                return { status: 'analyzed', ...analysis, modelo: GEMINI_MODEL, analisado_em: new Date().toISOString(), auto_approved: false };
            }
            const lockedTask = lockedRows[0];
            const awaitingAdmin = lockedTask.status === 'proof_submitted' && !lockedTask.concluido;
            const alreadyApproved = lockedTask.status === 'completed' && lockedTask.concluido;
            if (!awaitingAdmin && !alreadyApproved) {
                await conn.rollback();
                return { status: 'analyzed', ...analysis, modelo: GEMINI_MODEL, analisado_em: new Date().toISOString(), auto_approved: false };
            }
            const autoApprove = awaitingAdmin && shouldAutoApprove(analysis, lockedTask.completion_location_status);
            await conn.query(
                `UPDATE Tarefas SET completion_ai_status = 'analyzed', ai_resultado = ?, ai_confianca = ?,
                        ai_justificativa = ?, ai_modelo = ?, ai_analisado_em = NOW(), updated_at = NOW()
                 WHERE id = ? AND completion_photo_url IS NOT NULL AND status IN ('proof_submitted', 'completed')`,
                [analysis.resultado, analysis.confianca, analysis.justificativa, GEMINI_MODEL, taskId]
            );
            let approval = null;
            if (autoApprove) approval = await approveCompletionInTransaction(conn, lockedTask, null);
            await conn.commit();
            return {
                status: 'analyzed', ...analysis, modelo: GEMINI_MODEL,
                analisado_em: new Date().toISOString(), auto_approved: Boolean(approval),
                ...(approval ? { approval } : {}),
            };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error(`Análise Gemini indisponível para tarefa ${taskId}:`, error.message);
        return recordUnavailableAiAnalysis(taskId);
    }
}

app.get('/admin/tarefas/:id/comprovacao', requireAuth, async (req, res) => {
    try {
        const id_tarefa = Number(req.params.id);
        const [rows] = await db.query(
            `SELECT t.id_horta, t.completion_photo_url FROM Tarefas t
             WHERE t.id = ? AND t.status IN ('proof_submitted', 'completed') AND t.completion_photo_url IS NOT NULL AND t.deleted_at IS NULL
             LIMIT 1`,
            [id_tarefa]
        );
        if (!rows.length || !rows[0].completion_photo_url) return res.status(404).send({ error: 'Foto de comprovação não encontrada' });
        if (!await isAdminForHorta(req.user.id, rows[0].id_horta)) {
            return res.status(403).send({ error: 'Apenas o Admin da horta pode consultar esta foto' });
        }
        const filename = path.basename(rows[0].completion_photo_url);
        const filePath = path.join(taskProofDir, filename);
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).send({ error: 'Arquivo de comprovação não encontrado' });
        }
        return res.sendFile(filePath);
    } catch (error) {
        console.error('Erro ao consultar foto administrativa da tarefa:', error);
        return res.status(500).send({ error: 'Não foi possível consultar a foto' });
    }
});

app.post('/admin/tarefas/:id/aprovar-comprovacao', requireAuth, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const id_tarefa = Number(req.params.id);
        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) return res.status(400).send({ error: 'Tarefa inválida' });

        await conn.beginTransaction();
        const [rows] = await conn.query(
            `SELECT t.* FROM Tarefas t WHERE t.id = ? AND t.deleted_at IS NULL LIMIT 1 FOR UPDATE`,
            [id_tarefa]
        );
        if (!rows.length) {
            await conn.rollback();
            return res.status(404).send({ error: 'Tarefa não encontrada' });
        }
        const task = rows[0];
        const [adminRows] = await conn.query(
            "SELECT 1 FROM UsuarioHortaRole WHERE id_usuario = ? AND id_horta = ? AND papel = 'ADMIN' LIMIT 1",
            [req.user.id, task.id_horta]
        );
        if (!adminRows.length) {
            await conn.rollback();
            return res.status(403).send({ error: 'Apenas o Admin da horta pode aprovar esta comprovação' });
        }
        if (task.concluido || task.status !== 'proof_submitted' || !task.completion_photo_url) {
            await conn.rollback();
            return res.status(409).send({ error: 'A comprovação já foi analisada ou não está pronta para análise' });
        }

        const approval = await approveCompletionInTransaction(conn, task, req.user.id);
        await conn.commit();
        return res.send(approval);
    } catch (error) {
        await conn.rollback();
        if (error.statusCode) return res.status(error.statusCode).send({ error: error.message });
        console.error('Erro ao aprovar comprovação:', error);
        return res.status(500).send({ error: 'Não foi possível aprovar a comprovação' });
    } finally {
        conn.release();
    }
});

app.post('/admin/tarefas/:id/reprovar-comprovacao', requireAuth, async (req, res) => {
    const conn = await db.getConnection();
    try {
        const id_tarefa = Number(req.params.id);
        const motivo = typeof req.body.motivo === 'string' ? req.body.motivo.trim() : '';
        if (!Number.isInteger(id_tarefa) || id_tarefa <= 0) return res.status(400).send({ error: 'Tarefa inválida' });
        if (!motivo || motivo.length > 512) return res.status(400).send({ error: 'Informe um motivo de até 512 caracteres' });

        await conn.beginTransaction();
        const [rows] = await conn.query(
            `SELECT t.id_horta, t.id_perfil, t.status, t.concluido, t.completion_photo_url,
                    t.completion_latitude, t.completion_longitude, t.completion_location_status,
                    t.completion_location_distance_meters, t.completion_ai_status, t.ai_resultado,
                    t.ai_confianca, t.ai_justificativa, t.ai_modelo, t.ai_analisado_em,
                    t.completion_submitted_at
             FROM Tarefas t WHERE t.id = ? AND t.deleted_at IS NULL LIMIT 1 FOR UPDATE`,
            [id_tarefa]
        );
        if (!rows.length) {
            await conn.rollback();
            return res.status(404).send({ error: 'Tarefa não encontrada' });
        }
        const task = rows[0];
        const [adminRows] = await conn.query(
            "SELECT 1 FROM UsuarioHortaRole WHERE id_usuario = ? AND id_horta = ? AND papel = 'ADMIN' LIMIT 1",
            [req.user.id, task.id_horta]
        );
        if (!adminRows.length) {
            await conn.rollback();
            return res.status(403).send({ error: 'Apenas o Admin da horta pode reprovar esta comprovação' });
        }
        if (task.concluido || task.status !== 'proof_submitted' || !task.completion_photo_url) {
            await conn.rollback();
            return res.status(409).send({ error: 'A comprovação já foi analisada ou não está pronta para análise' });
        }

        await conn.query(
            `INSERT INTO TarefaComprovacaoHistorico
                (id_tarefa, id_perfil, foto_url, latitude, longitude, localizacao_status,
                 distancia_metros, ai_status, ai_resultado, ai_confianca, ai_justificativa,
                 ai_modelo, ai_analisado_em, motivo_reprovacao, revisado_por, enviado_em, rejeitado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [id_tarefa, task.id_perfil, task.completion_photo_url, task.completion_latitude,
                task.completion_longitude, task.completion_location_status,
                task.completion_location_distance_meters, task.completion_ai_status,
                task.ai_resultado, task.ai_confianca, task.ai_justificativa, task.ai_modelo,
                task.ai_analisado_em, motivo, req.user.id, task.completion_submitted_at]
        );

        const [updateResult] = await conn.query(
            `UPDATE Tarefas
             SET status = 'in_progress', completion_photo_url = NULL,
                 completion_latitude = NULL, completion_longitude = NULL,
                 completion_location_status = 'not_requested', completion_location_distance_meters = NULL,
                 completion_ai_status = 'not_requested', ai_resultado = NULL, ai_confianca = NULL,
                 ai_justificativa = NULL, ai_modelo = NULL, ai_analisado_em = NULL,
                 completion_review_status = 'rejected', completion_review_note = ?,
                 completion_reviewed_by = ?, completion_reviewed_at = NOW(), updated_at = NOW()
             WHERE id = ? AND status = 'proof_submitted' AND concluido = false`,
            [motivo, req.user.id, id_tarefa]
        );
        if (updateResult.affectedRows !== 1) {
            await conn.rollback();
            return res.status(409).send({ error: 'A comprovação já foi analisada' });
        }
        await conn.commit();
        return res.send({ ok: true, status: 'in_progress', review_status: 'rejected', motivo });
    } catch (error) {
        await conn.rollback();
        console.error('Erro ao reprovar comprovação:', error);
        return res.status(500).send({ error: 'Não foi possível reprovar a comprovação' });
    } finally {
        conn.release();
    }
});

const port = 8080;
ensureGamificationSchema().then(() => {
    app.listen(port, () => {
        console.log(`⚡️[bootup]: Server is running at port: ${port}`);
    });
}).catch((error) => {
    console.error('Erro ao preparar dados de gamificacao:', error);
    process.exit(1);
});
