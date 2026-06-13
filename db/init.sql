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
  dificuldade int  ,
  impacto_ambiental float,
  id_perfil int,
  concluido TINYINT(1),
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
