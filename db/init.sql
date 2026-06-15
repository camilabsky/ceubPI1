CREATE TABLE IF NOT EXISTS Perfil (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(64)
);
CREATE TABLE IF NOT EXISTS Recompensas (
  id int AUTO_INCREMENT PRIMARY KEY,
  nome varchar(128),
  descricao text,
  preco int,
  tipo varchar(32),
  src varchar(256)
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
  CONSTRAINT fk_perfil_tarefas
  FOREIGN KEY (id_perfil)
  REFERENCES Perfil(id)
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
  GROUP BY id_perfil
) t ON p.id = t.id_perfil
LEFT JOIN (
  SELECT pr.id_perfil, SUM(rec.preco) AS total_gasto
  FROM PerfilRecompensas pr
  JOIN Recompensas rec ON pr.id_recompensa = rec.id
  GROUP BY pr.id_perfil
) r ON p.id = r.id_perfil;
