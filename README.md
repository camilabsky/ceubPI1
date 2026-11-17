# ceubPI1
Matéria de Projeto Integrador 1 do curso de ADS 

Temas do projeto:
Hortas urbanas (continuação do TCC da camila)
https://docs.google.com/presentation/d/17Y2aORbqRmVt4SSF9ILtmgEn6hmZKHEDTKdAgGd03f0/edit?usp=sharing

# Hortas Urbanas Comunitárias
Os problemas das hortas urbanas comunitárias e possíveis soluções de TI

## 🌱 Contexto do Projeto

As hortas urbanas comunitárias têm se tornado uma tendência crescente nas grandes cidades, representando uma alternativa sustentável para produção de alimentos, fortalecimento de laços comunitários e melhoria da qualidade de vida urbana. No entanto, diversos desafios impedem que essas iniciativas alcancem seu potencial máximo.

## 🎯 Objetivo Geral

Desenvolver uma solução tecnológica que identifique, analise e resolva os principais problemas enfrentados pelas hortas urbanas comunitárias, promovendo maior eficiência, sustentabilidade e engajamento da comunidade através de ferramentas digitais inovadoras.

### Desafios Atuais das Hortas Urbanas Comunitárias:

**🗓️ Gestão e Organização**
- Dificuldade na coordenação de atividades entre voluntários
- Falta de controle sobre cronogramas de plantio e colheita
- Ausência de registros históricos das atividades

**💧 Manejo Técnico**
- Conhecimento limitado sobre técnicas de cultivo adequadas
- Problemas com irrigação e cuidado das plantas*
- Dificuldades no controle de pragas e doenças

**👥 Engajamento Comunitário**
- Baixa participação contínua dos moradores*
- Comunicação ineficiente entre os participantes
- Falta de transparência na gestão dos recursos

**📈 Sustentabilidade Financeira**
- Dificuldades em captar e gerenciar recursos
- Falta de visibilidade para potenciais apoiadores
- Ausência de métricas de impacto social e ambiental

**🏙️ Integração Urbana**
- Pouca visibilidade das hortas para a comunidade ampla
- Dificuldades na identificação de locais adequados para novas hortas
- Falta de conexão entre diferentes hortas da cidade

## 💡 Proposta de Solução

 Gamificação das Hortas Urbanas Comunitárias
*Transforme trabalho comunitário em recompensas reais*
As hortas urbanas comunitárias enfrentam um desafio crítico: **baixa participação contínua** e **dificuldades para engajar voluntários** nas tarefas essenciais de manutenção. Muitas hortas começam com entusiasmo, mas gradualmente perdem colaboradores, comprometendo a sustentabilidade dos projetos.

🎯 Conceito Central: HortaCoins(TEMPORÁRIO)

**Um aplicativo de gamificação** onde hortas urbanas podem **publicar tarefas** (regar plantas, capinar, plantar, colher) e os **usuários ganham moedas virtuais (HortaCoins)** ao completá-las. Essas moedas podem ser **trocadas por produtos frescos** das próprias hortas no futuro.

📊 Problema Identificado
🎯 **Desafio Principal: Engajamento e Continuidade**

**👥 Baixa Participação Sustentada**
- Voluntários começam animados mas abandonam as hortas após algumas semanas
- Tarefas essenciais (regar, capinar, plantar) ficam sem responsáveis
- Falta de incentivos tangíveis para manter participação regular

**⏰ Inconsistência nas Atividades**
- Hortas dependem da boa vontade esporádica dos moradores
- Plantas morrem por falta de cuidados regulares
- Colheitas são perdidas por falta de mão-de-obra no momento certo

**💔 Desconexão Comunidade-Benefício**
- Pessoas trabalham "de graça" mas não veem retorno direto
- Quem mais trabalha nem sempre é quem mais se beneficia
- Falta de reconhecimento pelo esforço investido

**🔄 Ciclo Vicioso**
- Menos pessoas → Menos cuidado → Piores resultados → Menos interesse → Menos pessoas

## 💡 Sistema de Gamificação

### 🎮 **Como Funciona o App**

**1. 📋 Hortas Publicam Tarefas**
- Gestores das hortas cadastram tarefas necessárias no app
- Cada tarefa tem: descrição, localização, dificuldade e recompensa em HortaCoins
- Exemplos: "Regar setor A (30 min)" = 50 HortaCoins, "Plantar mudas (2h)" = 200 HortaCoins

**2. 🏃‍♀️ Usuários Escolhem e Executam**
- Voluntários veem tarefas disponíveis próximas a eles
- Escolhem baseado em tempo disponível, interesse e recompensa
- Check-in/check-out com geolocalização e fotos comprova execução

**3. 🪙 Ganham Moedas**
- Gestores da horta validam tarefa completada
- HortaCoins são creditadas automaticamente na carteira do usuário
- Sistema de streak bonifica usuários consistentes

**4. 🥕 Trocam por Produtos Reais**
- HortaCoins podem ser trocadas por produtos das colheitas
- "Catálogo de Recompensas" atualizado conforme disponibilidade
- Agendamento de retirada dos produtos diretamente no app

🔄 **Economia Circular Digitalizada**
```
Trabalho → HortaCoins → Produtos Frescos → Mais Incentivo → Mais Trabalho
```


## 🌟 Visão de Futuro: O Impacto do app
### 🏙️ **Transformação Urbana**
Imagine uma cidade onde **milhares de pessoas** contribuem semanalmente para hortas urbanas, não por obrigação, mas porque **ganham algo real em troca**. Onde **alimentos frescos** são acessíveis a todos que contribuem com trabalho comunitário.


### 🔄 **Economia Circular Real**
```
Mais Trabalho → Mais Produção → Mais Produtos → Mais Incentivo → Mais Pessoas
```
**"Uma moeda social que conecta trabalho comunitário com alimentação saudável, criando cidades mais verdes e comunidades mais unidas."**

---

## 🚀 **Chamada para Ação**

### 💡 **Por que Agora?**
- **Pós-pandemia**: Maior consciência sobre segurança alimentar e saúde
- **Economia Compartilhada**: Apps como Uber/99 provaram que o modelo funciona
- **Sustentabilidade**: ESG é prioridade empresarial e governamental
- **Tecnologia Acessível**: Smartphones e internet móvel em massa


*Este projeto representa mais que um app - é um movimento para transformar como as cidades produzem alimentos e como as comunidades se organizam para o bem comum.*

---

## 📦 **Tech Stack**

### **Frontend**
- **React 18+** com TypeScript
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização
- **Shadcn/ui** - Componentes UI reutilizáveis
- **Axios/Fetch API** - Requisições HTTP

### **Backend**
- **Node.js** com Express.js
- **JWT (JSON Web Tokens)** - Autenticação
- **MySQL 8.0** - Banco de dados relacional

### **Infraestrutura**
- **Docker & Docker Compose** - Containerização
- **Nginx** (opcional) - Reverse proxy

### **Arquitetura**
- API RESTful
- Autenticação baseada em JWT com Bearer tokens
- Role-based access control (RBAC) para admin/usuário
- Banco de dados relacional com soft deletes
- Imagens com fallback SVG para recompensas

---

## 🚀 **Como Rodar o Projeto**

### **Pré-requisitos**
- Docker e Docker Compose instalados
- Git para clonar o repositório
- Um navegador moderno (Chrome, Firefox, Safari, Edge)

### **Instalação e Execução**

1. **Clone o repositório**
   ```bash
   git clone <seu-repo-url>
   cd ceubPI1
   ```

2. **Inicie os containers com Docker Compose**
   ```bash
   docker compose up
   ```
   Isso irá:
   - Criar e popular o banco de dados MySQL
   - Iniciar o backend Node.js na porta 8080
   - Iniciar o frontend Vite na porta 3000

3. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:3306

### **Parar os containers**
   ```bash
   docker compose down
   ```

### **Dados de Teste**

A aplicação inclui seed data com usuários de exemplo:

**Usuário Comum:**
- Email: `user@horta.local`
- Senha: `senha123`

**Administrador (Gestor de Horta):**
- Email: `admin@horta.local`
- Senha: `senha123`

---

## 📁 **Estrutura do Projeto**

```
ceubPI1/
├── frontend/              # React app com Vite
│   ├── src/
│   │   ├── components/    # Páginas: TasksPage, RewardsPage, ProfilePage
│   │   ├── App.tsx        # Router principal
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── Dockerfile
│
├── backend/               # Express API
│   ├── index.js           # Servidor e endpoints
│   ├── package.json
│   └── Dockerfile
│
├── db/                    # Database initialization
│   ├── init.sql           # Schema + seed data
│   └── config.cnf         # Configuração MySQL
│
└── docker-compose.yml     # Orquestração dos containers
```

---

## 🔌 **Principais Endpoints da API**

### **Autenticação**
- `POST /auth/login` - Login (retorna JWT token)

### **Tarefas**
- `GET /tarefas_disponiveis` - Listar tarefas disponíveis
- `POST /tarefas` (admin) - Criar tarefa
- `PUT /tarefas/:id` (admin) - Atualizar tarefa
- `DELETE /tarefas/:id` (admin) - Deletar tarefa

### **Recompensas**
- `GET /recompensas` - Listar recompensas disponíveis
- `POST /recompensas` (admin) - Criar recompensa
- `PUT /recompensas/:id` (admin) - Atualizar recompensa
- `DELETE /recompensas/:id` (admin) - Deletar recompensa

### **Histórico do Usuário**
- `GET /me/historico` - Tarefas concluídas e recompensas resgatadas do usuário

### **Histórico da Horta (Admin)**
- `GET /admin/horta/historico?id_horta=1` - Tarefas concluídas e recompensas resgatadas da horta

---

## 📝 **Funcionalidades**

✅ Autenticação com JWT  
✅ Gestão de tarefas (CRUD completo)  
✅ Gestão de recompensas (CRUD completo)  
✅ Sistema de gamificação com moedas virtuais (HortaCoins)  
✅ Histórico de tarefas concluídas por usuário  
✅ Histórico de recompensas resgatadas por usuário  
✅ Panel administrativo integrado nas abas  
✅ Histórico de atividades da horta (para admin)  
✅ Fallback visual para imagens externas bloqueadas  

---

## �️ **Estrutura do Banco de Dados**

### **Tabelas Principais**

#### **Perfil**
Perfis de usuários que acumulam pontos e conquistam recompensas.
```
id (PK)           | int          | Auto-increment
nome              | varchar(64)  | Nome do perfil
```

#### **Usuario**
Usuários que fazem login na plataforma.
```
id (PK)                   | int          | Auto-increment
nome                      | varchar(128) | Nome completo
email (UNIQUE)            | varchar(128) | Email único
password_hash             | varchar(255) | Hash bcrypt da senha (NULL para contas criadas só com Google)
ativo                     | boolean      | Status ativo/inativo
id_perfil (FK)            | int          | Referência ao Perfil
cidade                    | varchar(100) | Cidade do usuário (opcional)
uf                        | char(2)      | UF do usuário (opcional, junto com a cidade)
telefone                  | varchar(24)  | Telefone do usuário (opcional)
last_login_at             | datetime     | Último login (acompanhamento de frequência)
```

#### **PasswordResetToken**
Tokens de recuperação de senha.
```
id (PK)          | int          | Auto-increment
id_usuario       | int          | Usuário que pediu a recuperação
token_hash       | char(64)     | Hash do token (UNIQUE)
expires_at       | datetime     | Validade do token
used_at          | datetime     | Quando foi usado (NULL se ainda não usado)
created_at       | datetime     | Criação do token
```

#### **Horta**
Hortas urbanas cadastradas no sistema.
```
id (PK)      | int            | Auto-increment
nome (UNIQUE)| varchar(128)   | Nome da horta
descricao    | varchar(255)   | Descrição da horta
latitude     | decimal(10,8)  | Latitude (opcional)
longitude    | decimal(11,8)  | Longitude (opcional)
endereco     | varchar(255)   | Endereço ou localização
cidade       | varchar(100)   | Cidade
uf           | char(2)        | UF
telefone     | varchar(24)    | Telefone de contato (opcional)
email        | varchar(160)   | E-mail de contato (opcional)
```

#### **UsuarioHortaRole**
Relacionamento muitos-para-muitos entre Usuário e Horta com papéis.
```
id_usuario (FK, PK) | int         | Referência ao Usuario
id_horta (FK, PK)   | int         | Referência ao Horta
papel (PK)          | varchar(16) | ADMIN ou MEMBER
```

#### **Tarefas**
Tarefas disponíveis nas hortas que usuários podem completar.
```
id (PK)              | int          | Auto-increment
titulo               | varchar(128) | Título da tarefa
tipo                 | varchar(32)  | Plantio, Manutenção, Colheita, Compostagem
descricao            | varchar(128) | Descrição breve
dificuldade          | int          | Nível de dificuldade
moedas               | int          | HortaCoins como recompensa
moedas_recebidas     | int          | Moedas efetivamente creditadas na conclusão
xp                   | int          | XP oferecido pela tarefa (padrão 50)
xp_recebido          | int          | XP efetivamente creditado na conclusão
mudas                | int          | Quantidade de mudas entregues (se houver)
tempo                | int          | Tempo estimado em minutos
horta                | varchar(128) | Nome da horta (redundante com id_horta)
concluido            | boolean      | Status de conclusão
status               | varchar(24)  | available, in_progress, pending_review, proof_submitted, completed
id_perfil (FK)       | int          | Perfil que aceitou/completou a tarefa
id_horta (FK)        | int          | Horta associada
created_by (FK)      | int          | Usuário que criou a tarefa
updated_at           | datetime     | Última atualização
completed_at         | datetime     | Quando foi concluída
deleted_at           | datetime     | Soft delete timestamp
```

Colunas de comprovação (foto, localização e análise automática):
```
completion_submitted_at    | datetime      | Envio da comprovação
completion_photo_url       | varchar(512)  | Foto enviada
completion_latitude        | decimal(10,8) | Latitude da comprovação
completion_longitude       | decimal(11,8) | Longitude da comprovação
completion_review_status   | varchar(24)   | pending, approved ou rejected
completion_review_note     | varchar(512)  | Observação da revisão
completion_reviewed_by     | int           | Admin que revisou
completion_reviewed_at     | datetime      | Data da revisão
completion_ai_status       | varchar(24)   | Estado da análise de IA
ai_resultado               | varchar(24)   | Resultado da análise
ai_confianca               | decimal(4,3)  | Confiança da análise
ai_justificativa           | varchar(512)  | Justificativa da análise
ai_modelo                  | varchar(64)   | Modelo usado
ai_analisado_em            | datetime      | Quando foi analisada
```

#### **TarefaComprovacaoHistorico**
Histórico de comprovações reprovadas de uma tarefa.
```
id (PK)             | int           | Auto-increment
id_tarefa           | int           | Tarefa avaliada
id_perfil           | int           | Perfil que enviou
foto_url            | varchar(512)  | Foto reprovada
latitude/longitude  | decimal       | Localização enviada
localizacao_status  | varchar(32)   | Resultado da checagem de localização
distancia_metros    | int           | Distância até a horta
ai_*                | -             | Dados da análise de IA da época
motivo_reprovacao   | varchar(512)  | Motivo da reprovação
revisado_por        | int           | Admin que reprovou
enviado_em          | datetime      | Envio original
rejeitado_em        | datetime      | Quando foi reprovada
```

#### **Recompensas**
Recompensas que usuários podem resgatar com suas moedas.
```
id (PK)                  | int          | Auto-increment
nome                     | varchar(128) | Nome da recompensa
descricao                | text         | Descrição detalhada
tipo                     | varchar(32)  | Produto, Ferramentas, Plantas, Educação, Acessórios, Workshop
preco                    | int          | Custo em HortaCoins
src                      | varchar(256) | URL da imagem da recompensa
quantidade_disponivel    | int          | Unidades disponíveis
id_horta (FK)            | int          | Horta que oferece a recompensa
created_by (FK)          | int          | Usuário que criou a recompensa
updated_at               | datetime     | Última atualização
deleted_at               | datetime     | Soft delete timestamp
```

#### **PerfilRecompensas**
Histórico de recompensas resgatadas por usuários.
```
id_perfil (FK)         | int      | Referência ao Perfil
id_recompensa (FK)     | int      | Referência ao Recompensas
redeemed_at            | datetime | Quando foi resgatada
redeemed_price         | int      | Preço pago no momento do resgate
```

#### **PerfilGamificacao**
Progresso de gamificação de cada perfil.
```
id_perfil (PK, FK)   | int      | Referência ao Perfil
xp_total             | int      | XP acumulado
streak_days          | int      | Dias seguidos de atividade
last_activity_date   | date     | Última atividade
created_at           | datetime | Criação
updated_at           | datetime | Última atualização
```

#### **ConquistasPerfil**
Conquistas desbloqueadas por perfil (única por `id_perfil` + `achievement_key`).
```
id (PK)          | int         | Auto-increment
id_perfil (FK)   | int         | Referência ao Perfil
achievement_key  | varchar(48) | Identificador da conquista
xp_awarded       | int         | XP concedido
unlocked_at      | datetime    | Quando foi desbloqueada
```


### **Soft Deletes**

Todas as tabelas com dados mestre (`Tarefas` e `Recompensas`) implementam soft deletes via coluna `deleted_at`. Registros nunca são realmente deletados do banco, apenas marcados com timestamp de deleção.

```sql
-- Exemplo de query com soft delete
SELECT * FROM Tarefas WHERE deleted_at IS NULL;
```

---

## �👥 **Contribuidores**

Projeto desenvolvido pela turma de Projeto Integrador 1 do curso de ADS
