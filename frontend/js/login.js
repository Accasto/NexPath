/* ==========================================
   login.js — NexPath
   Validação e envio do formulário de login
   ========================================== */

const API_URL = 'http://localhost:3000';

async function validarLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;

  // Validações básicas no frontend
  if (email === '' || senha === '') {
    alert('Preencha email e senha.');
    return false;
  }
  if (!email.includes('@')) {
    alert('Digite um email válido.');
    return false;
  }
  if (senha.length < 8) {
    alert('A senha precisa ter no mínimo 8 caracteres.');
    return false;
  }

  try {
    // Envia as credenciais para o backend
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao fazer login.');
      return false;
    }

    // Salva o token JWT e dados do usuário no sessionStorage
    sessionStorage.setItem('nexpath_token', dados.token);
    sessionStorage.setItem('nexpath_usuario', dados.usuario.usuario);
    sessionStorage.setItem('nexpath_nome', dados.usuario.nome);

    // Redireciona para o dashboard
    window.location.href = 'dashboard.html';

  } catch (err) {
    alert('Erro ao conectar ao servidor. Verifique se o backend está rodando.');
    console.error(err);
  }

  return false;
}