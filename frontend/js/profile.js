/* ==========================================
   profile.js — NexPath
   Lógica da página de perfil
   ========================================== */

const API_URL = 'http://localhost:3000';

/* ------------------------------------------
   Inicialização
   ------------------------------------------ */

document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('nexpath_token');
    const usuario = sessionStorage.getItem('nexpath_usuario');

    // Redireciona se não estiver logado
    if (!token || !usuario) {
        window.location.href = 'login.html';
        return;
    }

    // Preenche navbar
    const navUsuario = document.getElementById('nav-usuario');
    if (navUsuario) navUsuario.textContent = '@' + usuario;

    // Carrega dados do perfil
    carregarPerfil();
});


/* ------------------------------------------
   Carregar perfil do backend
   ------------------------------------------ */

async function carregarPerfil() {
    const token = sessionStorage.getItem('nexpath_token');

    try {
        const resposta = await fetch(`${API_URL}/perfil`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!resposta.ok) {
            logout();
            return;
        }

        const dados = await resposta.json();

        // Preenche campos
        document.getElementById('field-nome').value = dados.nome || '';
        document.getElementById('field-usuario').value = dados.usuario || '';
        document.getElementById('field-email').value = dados.email || '';
        document.getElementById('field-telefone').value = dados.telefone || '';
        document.getElementById('field-nascimento').value = dados.nascimento ? dados.nascimento.substring(0, 10) : '';

        // Sidebar
        const sideUsuario = document.getElementById('sidebar-usuario');
        const sideRole = document.getElementById('sidebar-role');
        const avatarInitials = document.getElementById('avatar-initials');

        if (sideUsuario) sideUsuario.textContent = '@' + dados.usuario;
        if (sideRole) {
            sideRole.textContent = dados.role === 'admin' ? '⭐ Administrador' : 'Usuário';
            sideRole.style.color = dados.role === 'admin' ? 'var(--cyan-neon)' : 'var(--text-dim)';
        }

        // Iniciais no avatar
        if (avatarInitials) {
            const iniciais = dados.nome
                .split(' ')
                .map(function (p) { return p[0]; })
                .slice(0, 2)
                .join('')
                .toUpperCase();
            avatarInitials.textContent = iniciais;
        }

        // Mostra link do painel admin se for admin
        const role = dados.role;
        sessionStorage.setItem('nexpath_role', role);
        if (role === 'admin') {
            const adminLink = document.getElementById('admin-nav-link');
            if (adminLink) adminLink.style.display = 'flex';
        }

    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}


/* ------------------------------------------
   Troca de abas
   ------------------------------------------ */

function trocarAba(nomeAba, el) {
    // Remove active de todas as abas e itens de nav
    document.querySelectorAll('.profile-tab').forEach(function (tab) {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.profile-nav-item').forEach(function (item) {
        item.classList.remove('active');
    });

    // Ativa a aba clicada
    const tabAlvo = document.getElementById('tab-' + nomeAba);
    if (tabAlvo) tabAlvo.classList.add('active');
    if (el) el.classList.add('active');
}


/* ------------------------------------------
   Edição de perfil
   ------------------------------------------ */

function toggleEdicao() {
    const campos = ['field-nome', 'field-telefone'];
    const btnEditar = document.getElementById('btn-editar');
    const btnSalvar = document.getElementById('btn-salvar');
    const editando = btnSalvar.style.display !== 'none';

    if (editando) {
        // Cancela edição
        campos.forEach(function (id) { document.getElementById(id).disabled = true; });
        btnSalvar.style.display = 'none';
        btnEditar.textContent = 'Editar perfil';
        carregarPerfil(); // Recarrega dados originais
    } else {
        // Habilita edição
        campos.forEach(function (id) { document.getElementById(id).disabled = false; });
        btnSalvar.style.display = 'inline-block';
        btnEditar.textContent = 'Cancelar';
    }
}

async function salvarPerfil() {
    const token = sessionStorage.getItem('nexpath_token');
    const nome = document.getElementById('field-nome').value.trim();
    const telefone = document.getElementById('field-telefone').value.trim();

    if (!nome) {
        mostrarPopup('O nome não pode estar vazio.', 'erro');
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/perfil`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ nome, telefone })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarPopup(dados.erro || 'Erro ao salvar.', 'erro');
            return;
        }

        // Atualiza sessionStorage com novo nome
        sessionStorage.setItem('nexpath_nome', dados.usuario.nome);

        mostrarPopup('Perfil atualizado com sucesso!', 'sucesso', function () {
            toggleEdicao();
        });

    } catch (err) {
        mostrarPopup('Erro ao conectar ao servidor.', 'erro');
        console.error(err);
    }
}


/* ------------------------------------------
   Alterar senha
   ------------------------------------------ */

async function alterarSenha() {
    const token = sessionStorage.getItem('nexpath_token');
    const senhaAtual = document.getElementById('cfg-senha-atual').value;
    const senhaNova = document.getElementById('cfg-senha-nova').value;
    const senhaConfirmar = document.getElementById('cfg-senha-confirmar').value;

    if (!senhaAtual || !senhaNova || !senhaConfirmar) {
        mostrarPopup('Preencha todos os campos de senha.', 'erro');
        return;
    }
    if (senhaNova !== senhaConfirmar) {
        mostrarPopup('As senhas novas não coincidem.', 'erro');
        return;
    }
    if (senhaNova.length < 8) {
        mostrarPopup('A nova senha precisa ter pelo menos 8 caracteres.', 'erro');
        return;
    }
    if (!/[A-Z]/.test(senhaNova) || !/[0-9]/.test(senhaNova) || !/[!@#$%^&*]/.test(senhaNova)) {
        mostrarPopup('A nova senha precisa ter maiúscula, número e símbolo.', 'erro');
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/perfil/senha`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ senhaAtual, senhaNova })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarPopup(dados.erro || 'Erro ao alterar senha.', 'erro');
            return;
        }

        // Limpa os campos
        document.getElementById('cfg-senha-atual').value = '';
        document.getElementById('cfg-senha-nova').value = '';
        document.getElementById('cfg-senha-confirmar').value = '';

        mostrarPopup('Senha alterada com sucesso!', 'sucesso');

    } catch (err) {
        mostrarPopup('Erro ao conectar ao servidor.', 'erro');
        console.error(err);
    }
}


/* ------------------------------------------
   Excluir conta
   ------------------------------------------ */

async function excluirConta() {
    const token = sessionStorage.getItem('nexpath_token');
    const senha = document.getElementById('excluir-senha').value;

    if (!senha) {
        mostrarPopup('Digite sua senha para confirmar.', 'erro');
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/perfil`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarPopup(dados.erro || 'Erro ao excluir conta.', 'erro');
            return;
        }

        mostrarPopup('Conta excluída. Até logo!', 'sucesso', function () {
            logout();
        });

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