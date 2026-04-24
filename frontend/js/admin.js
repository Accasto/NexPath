/* ==========================================
   admin.js — NexPath
   Lógica do painel de administração
   ========================================== */

const API_URL = 'http://localhost:3000';
let todosUsuarios = [];

/* ------------------------------------------
   Inicialização
   ------------------------------------------ */

document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('nexpath_token');
    const usuario = sessionStorage.getItem('nexpath_usuario');
    const role = sessionStorage.getItem('nexpath_role');

    // Só admin pode acessar
    if (!token || !usuario) {
        window.location.href = 'login.html';
        return;
    }
    if (role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    const navUsuario = document.getElementById('nav-usuario');
    if (navUsuario) navUsuario.textContent = '@' + usuario;

    carregarUsuarios();
});


/* ------------------------------------------
   Carregar lista de usuários
   ------------------------------------------ */

async function carregarUsuarios() {
    const token = sessionStorage.getItem('nexpath_token');

    try {
        const resposta = await fetch(`${API_URL}/admin/usuarios`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!resposta.ok) {
            window.location.href = 'dashboard.html';
            return;
        }

        todosUsuarios = await resposta.json();
        renderizarTabela(todosUsuarios);
        atualizarStats(todosUsuarios);

    } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        document.getElementById('tbody-usuarios').innerHTML =
            '<tr><td colspan="7" class="admin-loading">Erro ao carregar usuários.</td></tr>';
    }
}


/* ------------------------------------------
   Renderizar tabela
   ------------------------------------------ */

function renderizarTabela(usuarios) {
    const tbody = document.getElementById('tbody-usuarios');
    const usuarioLogado = sessionStorage.getItem('nexpath_usuario');

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="admin-loading">Nenhum usuário encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(function (u) {
        const isSelf = u.usuario === usuarioLogado;
        const data = new Date(u.criado_em).toLocaleDateString('pt-BR');

        return `
            <tr>
                <td class="td-id">#${u.id}</td>
                <td>${u.nome}</td>
                <td class="td-usuario">@${u.usuario}</td>
                <td class="td-email">${u.email}</td>
                <td>
                    <span class="role-badge role-${u.role}">
                        ${u.role === 'admin' ? '⭐ Admin' : 'Usuário'}
                    </span>
                </td>
                <td class="td-data">${data}</td>
                <td class="td-acoes">
                    ${!isSelf ? `
                        <button class="btn-action btn-role" onclick="alterarRole(${u.id}, '${u.role}')">
                            ${u.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                        </button>
                        <button class="btn-action btn-delete" onclick="excluirUsuario(${u.id}, '${u.nome}')">
                            Excluir
                        </button>
                    ` : '<span class="td-self">Você</span>'}
                </td>
            </tr>
        `;
    }).join('');
}


/* ------------------------------------------
   Atualizar estatísticas
   ------------------------------------------ */

function atualizarStats(usuarios) {
    document.getElementById('total-usuarios').textContent = usuarios.length;
    document.getElementById('total-admins').textContent = usuarios.filter(function (u) { return u.role === 'admin'; }).length;
}


/* ------------------------------------------
   Filtrar usuários
   ------------------------------------------ */

function filtrarUsuarios() {
    const busca = document.getElementById('busca-usuario').value.toLowerCase();
    const filtrados = todosUsuarios.filter(function (u) {
        return u.nome.toLowerCase().includes(busca) || u.usuario.toLowerCase().includes(busca) || u.email.toLowerCase().includes(busca);
    });
    renderizarTabela(filtrados);
}


/* ------------------------------------------
   Alterar role
   ------------------------------------------ */

async function alterarRole(id, roleAtual) {
    const token = sessionStorage.getItem('nexpath_token');
    const novaRole = roleAtual === 'admin' ? 'usuario' : 'admin';
    const acao = novaRole === 'admin' ? 'tornar admin' : 'remover de admin';

    if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

    try {
        const resposta = await fetch(`${API_URL}/admin/usuarios/${id}/role`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ role: novaRole })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarPopup(dados.erro || 'Erro ao alterar role.', 'erro');
            return;
        }

        mostrarPopup('Role atualizada com sucesso!', 'sucesso', carregarUsuarios);

    } catch (err) {
        mostrarPopup('Erro ao conectar ao servidor.', 'erro');
        console.error(err);
    }
}


/* ------------------------------------------
   Excluir usuário
   ------------------------------------------ */

async function excluirUsuario(id, nome) {
    const token = sessionStorage.getItem('nexpath_token');

    if (!confirm(`Tem certeza que deseja excluir "${nome}"? Esta ação é irreversível.`)) return;

    try {
        const resposta = await fetch(`${API_URL}/admin/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarPopup(dados.erro || 'Erro ao excluir usuário.', 'erro');
            return;
        }

        mostrarPopup('Usuário excluído com sucesso.', 'sucesso', carregarUsuarios);

    } catch (err) {
        mostrarPopup('Erro ao conectar ao servidor.', 'erro');
        console.error(err);
    }
}


/* ------------------------------------------
   Logout
   ------------------------------------------ */

function logout() {
    sessionStorage.removeItem('nexpath_token');
    sessionStorage.removeItem('nexpath_usuario');
    sessionStorage.removeItem('nexpath_nome');
    sessionStorage.removeItem('nexpath_role');
    window.location.href = 'login.html';
}