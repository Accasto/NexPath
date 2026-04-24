// ==========================================
// server.js — NexPath
// Backend principal — Node.js + Express
// ==========================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ==========================================
// CONEXÃO COM O POSTGRESQL
// ==========================================

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.connect()
    .then(() => console.log('✅ Conectado ao PostgreSQL!'))
    .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO JWT
// ==========================================

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido.' });
        req.usuario = usuario;
        next();
    });
}

// ==========================================
// ROTAS DE AUTENTICAÇÃO
// ==========================================

// POST /auth/registro — Criar nova conta
app.post('/auth/registro', async (req, res) => {
    const { nome, usuario, email, telefone, senha, nascimento } = req.body;

    try {
        // Checar email duplicado
        const emailExiste = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1', [email]
        );
        if (emailExiste.rows.length > 0) {
            return res.status(409).json({ erro: 'email_duplicado' });
        }

        // Checar username duplicado
        const usuarioExiste = await pool.query(
            'SELECT id FROM usuarios WHERE LOWER(usuario) = LOWER($1)', [usuario]
        );
        if (usuarioExiste.rows.length > 0) {
            return res.status(409).json({ erro: 'usuario_duplicado' });
        }

        // Criptografar a senha
        const senha_hash = await bcrypt.hash(senha, 10);

        // Inserir novo usuário
        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, usuario, email, telefone, senha_hash, nascimento)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, usuario, email`,
            [nome, usuario, email, telefone, senha_hash, nascimento]
        );

        res.status(201).json({
            mensagem: 'Conta criada com sucesso!',
            usuario: resultado.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// POST /auth/login — Login com email OU username
app.post('/auth/login', async (req, res) => {
    const { identificador, senha } = req.body;

    try {
        // Busca pelo email ou pelo username
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 OR usuario = $1',
            [identificador.toLowerCase()]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        const usuario = resultado.rows[0];

        // Verificar senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: usuario.id, usuario: usuario.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                usuario: usuario.usuario,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// ==========================================
// ROTAS DE TRANSAÇÕES
// ==========================================

app.get('/transacoes', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar transações.' });
    }
});

app.post('/transacoes', autenticar, async (req, res) => {
    const { tipo, valor, descricao, categoria, data } = req.body;
    try {
        const resultado = await pool.query(
            `INSERT INTO transacoes (usuario_id, tipo, valor, descricao, categoria, data)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.usuario.id, tipo, valor, descricao, categoria, data]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao criar transação.' });
    }
});

app.delete('/transacoes/:id', autenticar, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2',
            [req.params.id, req.usuario.id]
        );
        res.json({ mensagem: 'Transação deletada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao deletar transação.' });
    }
});

// ==========================================
// ROTAS DE METAS
// ==========================================

app.get('/metas', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM metas WHERE usuario_id = $1 ORDER BY criado_em DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar metas.' });
    }
});

app.post('/metas', autenticar, async (req, res) => {
    const { tipo, titulo, descricao, frequencia, data_fim } = req.body;
    try {
        const resultado = await pool.query(
            `INSERT INTO metas (usuario_id, tipo, titulo, descricao, frequencia, data_fim)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.usuario.id, tipo, titulo, descricao, frequencia, data_fim]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao criar meta.' });
    }
});

app.patch('/metas/:id', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'UPDATE metas SET concluida = TRUE WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [req.params.id, req.usuario.id]
        );
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao atualizar meta.' });
    }
});

// ==========================================
// ROTAS DE INVESTIMENTOS
// ==========================================

app.get('/investimentos', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM investimentos WHERE usuario_id = $1 ORDER BY data DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar investimentos.' });
    }
});

app.post('/investimentos', autenticar, async (req, res) => {
    const { tipo, descricao, valor_investido, valor_atual, data } = req.body;
    try {
        const resultado = await pool.query(
            `INSERT INTO investimentos (usuario_id, tipo, descricao, valor_investido, valor_atual, data)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.usuario.id, tipo, descricao, valor_investido, valor_atual, data]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar investimento.' });
    }
});

// ==========================================
// ROTAS DE DIETA
// ==========================================

app.get('/dieta', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM dieta WHERE usuario_id = $1 ORDER BY data DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar dieta.' });
    }
});

app.post('/dieta', autenticar, async (req, res) => {
    const { refeicao, descricao, calorias, proteinas, carboidratos, gorduras, data } = req.body;
    try {
        const resultado = await pool.query(
            `INSERT INTO dieta (usuario_id, refeicao, descricao, calorias, proteinas, carboidratos, gorduras, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.usuario.id, refeicao, descricao, calorias, proteinas, carboidratos, gorduras, data]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar refeição.' });
    }
});

// ==========================================
// ROTAS DE TREINOS
// ==========================================

app.get('/treinos', autenticar, async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM treinos WHERE usuario_id = $1 ORDER BY data DESC',
            [req.usuario.id]
        );
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar treinos.' });
    }
});

app.post('/treinos', autenticar, async (req, res) => {
    const { nome, tipo, duracao_min, calorias_gastas, observacoes, data } = req.body;
    try {
        const resultado = await pool.query(
            `INSERT INTO treinos (usuario_id, nome, tipo, duracao_min, calorias_gastas, observacoes, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [req.usuario.id, nome, tipo, duracao_min, calorias_gastas, observacoes, data]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao registrar treino.' });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});