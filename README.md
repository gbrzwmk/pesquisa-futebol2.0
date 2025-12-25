# ⚽ Pesquisa de Futebol - A Voz da Torcida

![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=CONCLUIDO&color=GREEN&style=for-the-badge)
![Badge Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Badge Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Badge Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## 💻 Sobre o Projeto

O **Pesquisa de Futebol** é uma plataforma interativa desenvolvida como Projeto Semestral para a **UniFECAF**. O objetivo é solucionar o problema de enquetes esportivas superficiais e "votos de robô".

Diferente de votações comuns, aqui aplicamos o conceito de **meritocracia do torcedor**: o peso do seu voto é definido pelo seu conhecimento sobre futebol.

### ⚙️ Como Funciona (Lógica de Negócio):
1.  **Cadastro & Login:** Sistema seguro com criptografia e autenticação via Token.
2.  **Gamificação (Quiz):** O usuário responde a 15 perguntas sobre a história do futebol.
3.  **Cálculo de Peso:** A nota do Quiz define o "peso" do voto (ex: 1 ponto base + 10 acertos = Peso 11).
4.  **Votação:** O usuário vota no seu time e o gráfico é atualizado em tempo real baseado na soma dos pesos.
5.  **Hub & Ranking:** Painel centralizado e Leaderboard dos usuários com maior conhecimento.

---

## 🎨 Layout e Funcionalidades

O projeto conta com um design **Mobile First**, responsivo e com tema escuro (Dark Mode) inspirado em partidas noturnas, utilizando Glassmorphism (efeito de vidro).

### Funcionalidades Principais:
- **Hub Central:** Painel de controle para acesso rápido às funções.
- **Wizard de Cadastro:** Fluxo em 3 etapas para melhor UX.
- **Quiz Dinâmico:** Perguntas aleatórias via API com feedback visual imediato.
- **Votação Ponderada:** Lógica backend que valida e computa o peso do voto.
- **Data Visualization:** Gráficos interativos (Chart.js) e Ranking em tempo real.

---

## 🛠 Tecnologias e Arquitetura

O projeto foi migrado de uma arquitetura monolítica para **Microserviços Serverless**, garantindo escalabilidade e organização.

### Frontend (Client-Side)
- **HTML5 & CSS3:** Flexbox, Grid, Media Queries e Animações CSS.
- **JavaScript (Vanilla):** Lógica modularizada sem frameworks pesados.
- **Chart.js:** Biblioteca para renderização de dados visuais.

### Backend (Serverless API)
- **Node.js:** Runtime das funções.
- **Vercel Functions:** Cada arquivo na pasta `/api` atua como uma rota independente.
- **JWT (JSON Web Token):** Gestão de sessão e segurança de rotas privadas.
- **Bcrypt:** Hashing de senhas para segurança.

### Banco de Dados
- **PostgreSQL (Neon/Vercel Postgres):** Banco relacional hospedado na nuvem.

---

## 📂 Estrutura de Pastas
/ ├── api/ # Backend (Serverless Functions) │ ├── _lib/ # Lógica compartilhada (Conexão DB) │ ├── login.js # Autenticação │ ├── submit-vote.js # Lógica de Voto com Peso │ └── ... │ ├── public/ # Frontend (Arquivos Estáticos) │ ├── index.html # Landing Page │ ├── style.css # Estilos Globais │ ├── hub.html # Painel Principal │ └── ... │ ├── vercel.json # Configuração de Rotas └── package.json # Dependências

---

## 🚀 Como Rodar o Projeto

Este projeto pode ser executado localmente simulando o ambiente Serverless da Vercel.

### Pré-requisitos
- Node.js instalado.
- Conta na Vercel (para conexão com o Banco de Dados).

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/SEU-USUARIO/pesquisa-futebol.git](https://github.com/SEU-USUARIO/pesquisa-futebol.git)
   cd pesquisa-futebol

2. Instale as dependências

Bash

npm install
Configure as Variáveis de Ambiente Para conectar ao banco na nuvem, baixe as credenciais do seu projeto Vercel:

Bash

vercel env pull .env.local
Inicie o Servidor Local

Bash

vercel dev
O projeto estará rodando em: http://localhost:3000

📱 Testando no Mobile (via Ngrok)
Para apresentar via QR Code e testar no celular:

Mantenha o vercel dev rodando.

Em outro terminal, exponha a porta 3000:

Bash

ngrok http 3000
Acesse o link gerado (ex: https://xxxx.ngrok-free.app) no celular.

🎲 Modelagem do Banco de Dados
Estrutura SQL utilizada no PostgreSQL:

SQL

-- Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    quiz_score INTEGER DEFAULT -1, -- -1 indica que não jogou
    created_at TIMESTAMP DEFAULT NOW()
);

-- Votos
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
    team TEXT NOT NULL,
    weight INTEGER DEFAULT 1 -- Peso do voto baseado no Quiz
);
👥 Autores
Gabriel Barbosa - Desenvolvimento Fullstack

📄 Licença
Este projeto foi desenvolvido para fins acadêmicos na Universidade UniFECAF.
