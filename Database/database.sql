-- ==========================================
-- database.sql — NexPath
-- Schema completo do banco de dados
-- ==========================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    nascimento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de sessões (controle de login/JWT)
CREATE TABLE IF NOT EXISTS sessoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW(),
    expira_em TIMESTAMP NOT NULL
);

-- Tabela de transações (receitas e despesas)
CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (
        tipo IN ('receita', 'despesa')
    ),
    valor NUMERIC(10, 2) NOT NULL,
    descricao VARCHAR(255),
    categoria VARCHAR(50),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investimentos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    descricao VARCHAR(255),
    valor_investido NUMERIC(10, 2) NOT NULL,
    valor_atual NUMERIC(10, 2),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de metas (rotina, dieta, treino, financeira)
CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (
        tipo IN (
            'rotina',
            'dieta',
            'treino',
            'financeira'
        )
    ),
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    frequencia VARCHAR(20) CHECK (
        frequencia IN ('diaria', 'semanal', 'mensal')
    ),
    concluida BOOLEAN DEFAULT FALSE,
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de dieta (refeições e macros)
CREATE TABLE IF NOT EXISTS dieta (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    refeicao VARCHAR(50) NOT NULL CHECK (
        refeicao IN (
            'cafe_manha',
            'almoco',
            'lanche',
            'jantar',
            'ceia'
        )
    ),
    descricao VARCHAR(255) NOT NULL,
    calorias INTEGER,
    proteinas NUMERIC(6, 2),
    carboidratos NUMERIC(6, 2),
    gorduras NUMERIC(6, 2),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS treinos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios (id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) CHECK (
        tipo IN (
            'musculacao',
            'cardio',
            'flexibility',
            'esporte',
            'outro'
        )
    ),
    duracao_min INTEGER,
    calorias_gastas INTEGER,
    observacoes VARCHAR(255),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    criado_em TIMESTAMP DEFAULT NOW()
);