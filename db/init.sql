CREATE TABLE IF NOT EXISTS Perfil (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(64)
);

CREATE TABLE IF NOT EXISTS Horta (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(128) NOT NULL UNIQUE,
  descricao varchar(255)
);

CREATE TABLE IF NOT EXISTS Usuario (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(128) NOT NULL,
  email varchar(128) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  ativo boolean default true,
  id_perfil int NULL,
  CONSTRAINT fk_usuario_perfil
  FOREIGN KEY (id_perfil)
  REFERENCES Perfil(id)
);

CREATE TABLE IF NOT EXISTS UsuarioHortaRole (
  id_usuario int NOT NULL,
  id_horta int NOT NULL,
  papel varchar(16) NOT NULL,
  PRIMARY KEY (id_usuario, id_horta, papel),
  CONSTRAINT fk_usuario_horta_role_usuario
  FOREIGN KEY (id_usuario)
  REFERENCES Usuario(id),
  CONSTRAINT fk_usuario_horta_role_horta
  FOREIGN KEY (id_horta)
  REFERENCES Horta(id)
);

CREATE TABLE IF NOT EXISTS Recompensas (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(128),
  descricao text,
  preco int,
  tipo varchar(32),
  src varchar(256),
  quantidade_disponivel int default 0,
  id_horta int NULL,
  created_by int NULL,
  updated_at datetime NULL,
  deleted_at datetime NULL,
  CONSTRAINT fk_recompensas_horta
  FOREIGN KEY (id_horta)
  REFERENCES Horta(id)
);
CREATE TABLE IF NOT EXISTS Tarefas (
  id int AUTO_INCREMENT PRIMARY KEY,
  titulo varchar(128),
  tipo varchar(32),
  dificuldade int,
  horta varchar(128),
  descricao varchar(128),
  id_perfil int,
  concluido boolean default false,
  moedas int,
  mudas int,
  tempo int,
  id_horta int NULL,
  created_by int NULL,
  updated_at datetime NULL,
  deleted_at datetime NULL,
  CONSTRAINT fk_perfil_tarefas
  FOREIGN KEY (id_perfil)
  REFERENCES Perfil(id),
  CONSTRAINT fk_tarefas_horta
  FOREIGN KEY (id_horta)
  REFERENCES Horta(id)
);
CREATE TABLE IF NOT EXISTS PerfilRecompensas (
  id_perfil int,
  id_recompensa int,
  CONSTRAINT fk_perfil_recompensas
  FOREIGN KEY (id_perfil)
  REFERENCES Perfil(id),
  CONSTRAINT fk_recompensas
  FOREIGN KEY (id_recompensa)
  REFERENCES Recompensas(id)
);

INSERT INTO Usuario (nome, email, password_hash, ativo)
SELECT 'Admin Horta Centro', 'admin@horta.local', '$2b$10$NqKGljuI.OwtX2ROYQUFN.UJ2mPtLPGeN3/ZyMMty2sYvfVdOnu8S', true
WHERE NOT EXISTS (
  SELECT 1 FROM Usuario WHERE email = 'admin@horta.local'
);

INSERT INTO Usuario (nome, email, password_hash, ativo)
SELECT 'Usuario Comunidade', 'user@horta.local', '$2b$10$jI/6XvERw7r.Yl5y9xSEeOhXs9oT5PkM7tZSvArB3FLICFs/VTzAS', true
WHERE NOT EXISTS (
  SELECT 1 FROM Usuario WHERE email = 'user@horta.local'
);

INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel)
SELECT u.id, h.id, 'ADMIN'
FROM Usuario u
JOIN Horta h ON h.nome = 'Horta Comunitaria Centro' OR h.nome = 'Horta Comunitária Centro'
LEFT JOIN UsuarioHortaRole r ON r.id_usuario = u.id AND r.id_horta = h.id AND r.papel = 'ADMIN'
WHERE u.email = 'admin@horta.local'
  AND r.id_usuario IS NULL;

INSERT INTO UsuarioHortaRole (id_usuario, id_horta, papel)
SELECT u.id, h.id, 'MEMBER'
FROM Usuario u
JOIN Horta h ON h.nome = 'Horta Comunitaria Centro' OR h.nome = 'Horta Comunitária Centro'
LEFT JOIN UsuarioHortaRole r ON r.id_usuario = u.id AND r.id_horta = h.id AND r.papel = 'MEMBER'
WHERE u.email = 'user@horta.local'
  AND r.id_usuario IS NULL;

INSERT INTO Tarefas (
  titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo
) VALUES
(
  "Preparar composto orgânico", "compostagem", "Horta Comunitária Centro",
  "Preparar composto orgânico ", 2, 150, 0, 60
), (
  "Regar plantas da seção A", "Manutenção", "Horta Comunitária Centro",
  "Realizar a rega das plantas na seção A do jardim durante a manhã", 0, 50, 0, 30
), (
  "Capinar canteiro de tomates", "Manutenção", "Jardim da Praça Verde",
  "Remover ervas daninhas do canteiro de tomates", 1, 80, 0, 60
), (
  "Plantar mudas de alface", "Plantio", "Horta Comunitária Centro",
  "Plantar 20 mudas de alface na área designada", 1, 120, 20, 90
),
(
  "Colher vegetais maduros", "colheita", "Horta Orgânica Vila Nova",
  "Fazer a colheita dos vegetais que estão prontos", 0, 100, 0, 45
), (
  "Podar ervas medicinais", "Manutenção", "Horta Bairro Esperança",
  "Realizar poda de alecrim e hortelã para estimular novo crescimento", 1, 90, 0, 50
), (
  "Preparar canteiro de cenoura", "Plantio", "Horta Comunitária Centro",
  "Afofar o solo e marcar linhas para plantio de cenoura", 1, 110, 40, 75
), (
  "Instalar cobertura morta", "Manutenção", "Jardim da Praça Verde",
  "Aplicar cobertura seca para reduzir perda de umidade", 2, 160, 0, 90
), (
  "Reforçar compostagem", "compostagem", "Horta Orgânica Vila Nova",
  "Misturar matéria seca e úmida na composteira principal", 1, 130, 0, 70
), (
  "Colher tomates maduros", "colheita", "Horta Bairro Esperança",
  "Fazer colheita seletiva de tomates maduros para distribuição", 0, 95, 0, 40
), (
  "Plantar mudas de couve", "Plantio", "Horta Comunitária Centro",
  "Plantar 15 mudas de couve no canteiro lateral", 1, 125, 15, 80
), (
  "Revisar irrigação por gotejamento", "Manutenção", "Horta Orgânica Vila Nova",
  "Checar vazamentos e ajustar fluxo dos gotejadores", 2, 170, 0, 95
);

INSERT INTO Recompensas (
  nome, descricao, tipo, preco, src
) VALUES (
  "Cesta de Vegetais Orgânicos", "Cesta com vegetais frescos da horta", "Produtos", 200,
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
), (
  'Kit de Ferramentas de Jardim', 'Kit básico com pá, rastelo e luvas', 'Ferramentas', 500,
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
), (
  'Mudas de Ervas Aromáticas', '5 mudas de manjericão, tomilho e alecrim', 'Plantas', 150,
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400'
), (
  'Workshop de Compostagem', 'Acesso ao workshop sobre compostagem doméstica', 'Educação', 300,
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'
), (
  'Sacola Ecológica Personalizada', 'Sacola reutilizável com logo da horta', 'Acessórios', 100,
  'https://images.unsplash.com/photo-1553531087-1ea13dd840ad?w=400'
), (
  'Cesta Premium de Vegetais', 'Cesta especial com vegetais selecionados', 'Produtos', 800,
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'
);

INSERT INTO Perfil (nome) VALUES ("Maria Silva");

UPDATE Usuario
SET id_perfil = 1
WHERE id_perfil IS NULL;

INSERT INTO Horta (nome, descricao)
SELECT x.horta, 'Horta cadastrada automaticamente pelo seed'
FROM (
  SELECT DISTINCT horta FROM Tarefas WHERE horta IS NOT NULL
) AS x
LEFT JOIN Horta h ON h.nome = x.horta
WHERE h.id IS NULL;

INSERT INTO Horta (nome, descricao)
SELECT 'Horta Geral', 'Horta padrao para recompensas sem horta especifica'
WHERE NOT EXISTS (
  SELECT 1 FROM Horta WHERE nome = 'Horta Geral'
);

UPDATE Tarefas t
JOIN Horta h ON h.nome = t.horta
SET t.id_horta = h.id
WHERE t.id_horta IS NULL;

UPDATE Recompensas r
JOIN Horta h ON h.nome = 'Horta Geral'
SET r.id_horta = h.id
WHERE r.id_horta IS NULL;

INSERT INTO Tarefas (
  titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo, id_horta, id_perfil, concluido, created_by
)
SELECT
  'Mutirao: preparo de canteiro central',
  'Manutenção',
  h.nome,
  'Organizar e preparar o canteiro principal para novos plantios',
  1,
  140,
  0,
  80,
  h.id,
  u.id_perfil,
  true,
  u.id
FROM Horta h
JOIN Usuario u ON u.email = 'admin@horta.local'
WHERE h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM Tarefas t
    WHERE t.titulo = 'Mutirao: preparo de canteiro central' AND t.id_horta = h.id
  );

INSERT INTO Tarefas (
  titulo, tipo, horta, descricao, dificuldade, moedas, mudas, tempo, id_horta, id_perfil, concluido, created_by
)
SELECT
  'Reforco de irrigacao do setor A',
  'Manutenção',
  h.nome,
  'Ajustar gotejadores e testar fluxo de agua no setor A',
  1,
  115,
  0,
  60,
  h.id,
  u.id_perfil,
  true,
  u.id
FROM Horta h
JOIN Usuario u ON u.email = 'admin@horta.local'
WHERE h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM Tarefas t
    WHERE t.titulo = 'Reforco de irrigacao do setor A' AND t.id_horta = h.id
  );

INSERT INTO Recompensas (
  nome, descricao, tipo, preco, src, quantidade_disponivel, id_horta, created_by
)
SELECT
  'Kit Sementes da Estacao',
  'Selecao de sementes para o proximo ciclo da horta comunitaria',
  'Produto',
  180,
  'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400',
  12,
  h.id,
  u.id
FROM Horta h
JOIN Usuario u ON u.email = 'admin@horta.local'
WHERE h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM Recompensas r
    WHERE r.nome = 'Kit Sementes da Estacao' AND r.id_horta = h.id
  );

INSERT INTO Recompensas (
  nome, descricao, tipo, preco, src, quantidade_disponivel, id_horta, created_by
)
SELECT
  'Oficina de Plantio Urbano',
  'Vaga em oficina pratica sobre cultivo em pequenos espacos',
  'Workshop',
  220,
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
  8,
  h.id,
  u.id
FROM Horta h
JOIN Usuario u ON u.email = 'admin@horta.local'
WHERE h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM Recompensas r
    WHERE r.nome = 'Oficina de Plantio Urbano' AND r.id_horta = h.id
  );

INSERT INTO PerfilRecompensas (id_perfil, id_recompensa)
SELECT u.id_perfil, r.id
FROM Usuario u
JOIN Recompensas r ON r.nome = 'Kit Sementes da Estacao'
JOIN Horta h ON h.id = r.id_horta
WHERE u.email = 'admin@horta.local'
  AND h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM PerfilRecompensas pr
    WHERE pr.id_perfil = u.id_perfil AND pr.id_recompensa = r.id
  );

INSERT INTO PerfilRecompensas (id_perfil, id_recompensa)
SELECT u.id_perfil, r.id
FROM Usuario u
JOIN Recompensas r ON r.nome = 'Oficina de Plantio Urbano'
JOIN Horta h ON h.id = r.id_horta
WHERE u.email = 'admin@horta.local'
  AND h.nome = 'Horta Comunitária Centro'
  AND NOT EXISTS (
    SELECT 1 FROM PerfilRecompensas pr
    WHERE pr.id_perfil = u.id_perfil AND pr.id_recompensa = r.id
  );

INSERT INTO
  PerfilRecompensas (id_recompensa)
VALUES
  (1), (1), (1), (1), (1),
  (2), (2),
  (3), (3), (3), (3), (3), (3), (3), (3),
  (4), (4), (4), (4), (4), (4), (4), (4), (4), (4),
  (5), (5), (5), (5), (5), (5), (5), (5), (5), (5), (5), (5), (5), (5), (5),
  (6), (6), (6);

CREATE VIEW RecompensasDisponiveis AS
SELECT Recompensas.*, cnt.total
FROM Recompensas
JOIN (
  SELECT COUNT(*) AS total, id_recompensa
  FROM PerfilRecompensas
  WHERE id_perfil IS NULL
  GROUP BY id_recompensa
) AS cnt
ON Recompensas.id = cnt.id_recompensa;

CREATE VIEW SaldoPerfil AS
SELECT
  COALESCE(t.total_moedas, 0) - COALESCE(r.total_gasto, 0) AS Saldo, 
  p.id as id_perfil
FROM Perfil p
LEFT JOIN (
  SELECT id_perfil, SUM(moedas) AS total_moedas
  FROM Tarefas
  WHERE concluido
  GROUP BY id_perfil
) t ON p.id = t.id_perfil
LEFT JOIN (
  SELECT pr.id_perfil, SUM(rec.preco) AS total_gasto
  FROM PerfilRecompensas pr
  JOIN Recompensas rec ON pr.id_recompensa = rec.id
  GROUP BY pr.id_perfil
) r ON p.id = r.id_perfil;
