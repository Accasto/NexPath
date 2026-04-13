/* ==========================================
   register.js — NexPath
   Validações e envio do formulário de cadastro
   ========================================== */

const API_URL = 'http://localhost:3000';

/* ------------------------------------------
   Validação de campos em tempo real
   ------------------------------------------ */

function validarNomeInput(input) {
  const regex = /^[a-zA-ZÀ-ÿ\s]*$/;
  if (!regex.test(input.value)) {
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    input.setCustomValidity('Use apenas letras e espaços.');
    input.reportValidity();
  } else {
    input.setCustomValidity('');
  }
}

function validarUsuarioInput(input) {
  const regex = /^[a-zA-Z0-9_]*$/;
  if (!regex.test(input.value)) {
    input.value = input.value.replace(/[^a-zA-Z0-9_]/g, '');
    input.setCustomValidity('Use apenas letras, números e _ (underline).');
    input.reportValidity();
  } else {
    input.setCustomValidity('');
  }
}


/* ------------------------------------------
   Listener de confirmação de senha
   ------------------------------------------ */

if (document.readyState !== 'loading') {
  setupListeners();
} else {
  document.addEventListener('DOMContentLoaded', setupListeners);
}

function setupListeners() {
  const senhaInput = document.getElementById('senha');
  const confirmarInput = document.getElementById('confirmarSenha');

  if (senhaInput && confirmarInput) {
    const validatePasswordMatch = function () {
      if (senhaInput.value !== confirmarInput.value) {
        confirmarInput.setCustomValidity('As senhas não são iguais.');
      } else {
        confirmarInput.setCustomValidity('');
      }
    };
    senhaInput.addEventListener('input', validatePasswordMatch);
    confirmarInput.addEventListener('input', validatePasswordMatch);
  }
}


/* ------------------------------------------
   Validação completa e envio ao backend
   ------------------------------------------ */

async function validarRegistro() {
  const nome = document.getElementById('nome');
  const usuario = document.getElementById('usuario');
  const email = document.getElementById('email');
  const telefone = document.getElementById('telefone');
  const dddPais = document.getElementById('dddPais');
  const senha = document.getElementById('senha');
  const confirmar = document.getElementById('confirmarSenha');
  const nascimento = document.getElementById('nascimento');
  const termos = document.getElementById('terms');

  [nome, usuario, email, telefone, senha, confirmar, nascimento, termos].forEach(function (el) {
    el.setCustomValidity('');
  });

  // Nome de usuário
  const usuarioValor = usuario.value.trim();
  if (!usuarioValor) {
    usuario.setCustomValidity('Escolha um nome de usuário.');
    usuario.reportValidity();
    return false;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(usuarioValor)) {
    usuario.setCustomValidity('Use apenas letras, números e _ (underline).');
    usuario.reportValidity();
    return false;
  }
  if (usuarioValor.length < 3) {
    usuario.setCustomValidity('Nome de usuário precisa ter pelo menos 3 caracteres.');
    usuario.reportValidity();
    return false;
  }

  // Telefone
  const telValor = telefone.value.trim();
  if (!telValor || telValor.length < 10 || telValor.length > 11) {
    telefone.setCustomValidity('Digite DDD + número. Ex: 11991234567');
    telefone.reportValidity();
    return false;
  }

  // Senha
  const senhaValor = senha.value;
  if (!senhaValor || senhaValor.length < 8) {
    senha.setCustomValidity('A senha precisa ter no mínimo 8 caracteres.');
    senha.reportValidity();
    return false;
  }
  if (!/[A-Z]/.test(senhaValor)) {
    senha.setCustomValidity('A senha precisa ter pelo menos uma letra maiúscula.');
    senha.reportValidity();
    return false;
  }
  if (!/[0-9]/.test(senhaValor)) {
    senha.setCustomValidity('A senha precisa ter pelo menos um número.');
    senha.reportValidity();
    return false;
  }
  if (!/[!@#$%^&*()\-_=+\[\]{};':",./<>?|`~\\]/.test(senhaValor)) {
    senha.setCustomValidity('A senha precisa ter pelo menos um símbolo! Ex: ! @ # $ % ^ & *');
    senha.reportValidity();
    return false;
  }
  if (/\s/.test(senhaValor)) {
    senha.setCustomValidity('A senha não pode conter espaços.');
    senha.reportValidity();
    return false;
  }
  if (senhaValor !== confirmar.value) {
    confirmar.setCustomValidity('As senhas não são iguais.');
    confirmar.reportValidity();
    return false;
  }

  // Data de nascimento
  const hoje = new Date();
  const dataNasc = new Date(nascimento.value);
  if (isNaN(dataNasc.getTime())) {
    nascimento.setCustomValidity('Data de nascimento inválida.');
    nascimento.reportValidity();
    return false;
  }
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) idade--;
  if (idade < 10) {
    nascimento.setCustomValidity('É necessário ter pelo menos 10 anos para criar uma conta.');
    nascimento.reportValidity();
    return false;
  }

  // Termos
  if (!termos.checked) {
    termos.setCustomValidity('Você precisa aceitar os termos de uso.');
    termos.reportValidity();
    return false;
  }

  try {
    const resposta = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome.value.trim(),
        usuario: usuarioValor.toLowerCase(),
        email: email.value.trim(),
        telefone: dddPais.value + telValor,
        senha: senhaValor,
        nascimento: nascimento.value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      if (dados.erro === 'email_duplicado') {
        mostrarPopup('Este email já está cadastrado.', 'erro');
      } else if (dados.erro === 'usuario_duplicado') {
        mostrarPopup('Este nome de usuário já está em uso. Escolha outro.', 'erro');
      } else {
        mostrarPopup(dados.erro || 'Erro ao criar conta.', 'erro');
      }
      return false;
    }

    // Sucesso — mostra popup e redireciona ao fechar
    mostrarPopup('Conta criada com sucesso! Você será redirecionado para o login.', 'sucesso', function () {
      window.location.href = 'login.html';
    });

  } catch (err) {
    mostrarPopup('Erro ao conectar ao servidor. Verifique se o backend está rodando.', 'erro');
    console.error(err);
  }

  return false;
}