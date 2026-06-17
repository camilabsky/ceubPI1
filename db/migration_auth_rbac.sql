ALTER TABLE Tarefas ADD COLUMN id_horta int NULL;
ALTER TABLE Tarefas ADD COLUMN created_by int NULL;
ALTER TABLE Tarefas ADD COLUMN updated_at datetime NULL;
ALTER TABLE Tarefas ADD COLUMN deleted_at datetime NULL;

ALTER TABLE Recompensas ADD COLUMN id_horta int NULL;
ALTER TABLE Recompensas ADD COLUMN created_by int NULL;
ALTER TABLE Recompensas ADD COLUMN updated_at datetime NULL;
ALTER TABLE Recompensas ADD COLUMN deleted_at datetime NULL;

ALTER TABLE Usuario ADD COLUMN id_perfil int NULL;

UPDATE Usuario u
SET u.id_perfil = 1
WHERE u.id_perfil IS NULL;

INSERT INTO Horta (nome, descricao)
SELECT x.horta, 'Horta cadastrada automaticamente'
FROM (SELECT DISTINCT horta FROM Tarefas WHERE horta IS NOT NULL) AS x
LEFT JOIN Horta h ON h.nome = x.horta
WHERE h.id IS NULL;

INSERT INTO Horta (nome, descricao)
SELECT 'Horta Geral', 'Horta padrao para recompensas'
WHERE NOT EXISTS (SELECT 1 FROM Horta WHERE nome = 'Horta Geral');

UPDATE Tarefas t
JOIN Horta h ON h.nome = t.horta
SET t.id_horta = h.id
WHERE t.id_horta IS NULL;

UPDATE Recompensas r
JOIN Horta h ON h.nome = 'Horta Geral'
SET r.id_horta = h.id
WHERE r.id_horta IS NULL;

INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel)
SELECT u.id, h.id, 'ADMIN'
FROM Usuario u
JOIN Horta h ON h.nome = 'Horta Comunitária Centro'
LEFT JOIN UsuarioHortaRole r ON r.id_usuario = u.id AND r.id_horta = h.id AND r.papel = 'ADMIN'
WHERE u.email = 'admin@horta.local' AND r.id_usuario IS NULL;

INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel)
SELECT u.id, h.id, 'MEMBER'
FROM Usuario u
JOIN Horta h ON h.nome = 'Horta Comunitária Centro'
LEFT JOIN UsuarioHortaRole r ON r.id_usuario = u.id AND r.id_horta = h.id AND r.papel = 'MEMBER'
WHERE u.email = 'user@horta.local' AND r.id_usuario IS NULL;
