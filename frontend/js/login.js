/* ==========================================
   login.js — NexPath
   Validação e envio do formulário de login
   ========================================== */

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      validarLogin();
    });
  }
});

async function validarLogin() {
  const identificador = document.getElementById('loginIdentificador').value.trim();
  const senha = document.getElementById('loginSenha').value;

  if (!identificador || !senha) {
    mostrarPopup('Preencha todos os campos.', 'erro');
    return;
  }
  if (senha.length < 8) {
    mostrarPopup('A senha precisa ter no mínimo 8 caracteres.', 'erro');
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarPopup(dados.erro || 'Erro ao fazer login.', 'erro');
      return;
    }

    // Salva token, dados e role do usuário
    sessionStorage.setItem('nexpath_token', dados.token);
    sessionStorage.setItem('nexpath_usuario', dados.usuario.usuario);
    sessionStorage.setItem('nexpath_nome', dados.usuario.nome);
    sessionStorage.setItem('nexpath_role', dados.usuario.role);

    window.location.href = 'dashboard.html';

  } catch (err) {
    mostrarPopup('Erro ao conectar ao servidor. Verifique se o backend está rodando.', 'erro');
    console.error(err);
  }
}