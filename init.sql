-- Cria a Tabela de Usuários (agora com password_hash)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    ano_nascimento TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL,
    cep TEXT NOT NULL,
    estado TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    quiz_score INTEGER DEFAULT -1 -- -1 = não fez, 0-5 = pontuação
);

-- Cria a Tabela de Votos (agora com user_id)
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE, -- 1 voto por usuário
    team TEXT NOT NULL
);