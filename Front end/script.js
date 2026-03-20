/* calculo de saldo (index) */

function calcular() {
    let receita = Number(document.getElementById("receita").value);
    let despesas = Number(document.getElementById("despesas").value);
    let saldo = receita - despesas;
    document.getElementById("saldo").innerText = saldo;
}


/* Popup com termos */

function abrirTermos() {
    document.getElementById("popup-termos").style.display = "flex";
}

function fecharTermos() {
    document.getElementById("popup-termos").style.display = "none";
}


/* VALIDAÇÃO DE CAMPOS */

// Nome completo: só aceita letras (incluindo acentos) e espaços
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

// Nome de usuário: só aceita letras, números e underline
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


/* VALIDAÇÃO COMPLETA */

function validarRegistro() {
    const nome = document.getElementById("nome");
    const usuario = document.getElementById("usuario");
    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");
    const senha = document.getElementById("senha");
    const confirmar = document.getElementById("confirmarSenha");
    const nascimento = document.getElementById("nascimento");
    const termos = document.getElementById("terms");

    // Limpar validações que vieram antes
    [nome, usuario, email, telefone, senha, confirmar, nascimento, termos].forEach(el => {
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

    // Telefone: DDD + (fixo de estado) + o numero de telefone
    const telValor = telefone.value.trim();
    if (!telValor || telValor.length < 10 || telValor.length > 11) {
        telefone.setCustomValidity('Digite DDD + número. Ex: 11991234567');
        telefone.reportValidity();
        return false;
    }

    // Senha: mínimo 8 caracteres, uma maiúscula, um número e um símbolo
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

    // Data de nascimento: mínimo 10 anos
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

    // Termos de uso
    if (!termos.checked) {
        termos.setCustomValidity('Você precisa aceitar os termos de uso.');
        termos.reportValidity();
        return false;
    }

    // ver se tem double user
    const usuarios = JSON.parse(localStorage.getItem('nexpath_usuarios') || '[]');
    if (usuarios.find(u => u.email === email.value.trim())) {
        email.setCustomValidity('Este email já está cadastrado.');
        email.reportValidity();
        return false;
    }
    if (usuarios.find(u => u.usuario === usuarioValor.toLowerCase())) {
        usuario.setCustomValidity('Este nome de usuário já está em uso.');
        usuario.reportValidity();
        return false;
    }

    // save por localstorage
    salvarUsuario();
    return false;
}


/* confirmação da senha */

if (document.readyState !== 'loading') {
    setupListeners();
} else {
    document.addEventListener('DOMContentLoaded', setupListeners);
}

function setupListeners() {
    const senhaInput = document.getElementById('senha');
    const confirmarInput = document.getElementById('confirmarSenha');

    if (senhaInput && confirmarInput) {
        const validatePasswordMatch = () => {
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


/* validção (funciona pfvr) */

function validarLogin() {
    let email = document.getElementById("loginEmail").value.trim();
    let senha = document.getElementById("loginSenha").value;

    if (email === "" || senha === "") {
        alert("Preencha email e senha.");
        return false;
    }
    if (!email.includes("@")) {
        alert("Digite um email válido.");
        return false;
    }
    if (senha.length < 8) {
        alert("A senha precisa ter no mínimo 8 caracteres.");
        return false;
    }

    // TODO: conectar ao backend pra DESGRAÇA autenticação
    alert("Login válido (backend ainda não conectado)");
    return true;
}

/* Troca de abas de recuperaçao */

function trocarAba(aba) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.recovery-section').forEach(sec => {
        sec.classList.remove('active');
    });

    const abas = ['email', 'usuario', 'telefone'];
    const idx = abas.indexOf(aba);
    document.querySelectorAll('.tab-btn')[idx].classList.add('active');
    document.getElementById('section-' + aba).classList.add('active');

    document.getElementById('successMsg').style.display = 'none';
}


/* Recuperação de conta */

function recuperarPor(metodo) {
    const msg = document.getElementById('successMsg');
    msg.style.display = 'none';

    if (metodo === 'email') {
        const email = document.getElementById('recEmail').value.trim();
        if (!email || !email.includes('@')) {
            alert('Digite um email válido.');
            return;
        }
        // TODO: checar no banco de dados se email existe
        const usuarios = JSON.parse(localStorage.getItem('nexpath_usuarios') || '[]');
        const encontrado = usuarios.find(u => u.email === email);
        if (encontrado) {
            msg.textContent = '✅ Link de recuperação enviado para ' + email;
        } else {
            msg.textContent = '❌ Email não encontrado. Verifique e tente novamente.';
        }
        msg.style.display = 'block';

    } else if (metodo === 'usuario') {
        const usuario = document.getElementById('recUsuario').value.trim();
        if (!usuario) {
            alert('Digite seu nome de usuário.');
            return;
        }
        // TODO: buscar email pelo username no ls
        const usuarios = JSON.parse(localStorage.getItem('nexpath_usuarios') || '[]');
        const encontrado = usuarios.find(u => u.usuario === usuario.toLowerCase());
        if (encontrado) {
            const emailOculto = ocultarEmail(encontrado.email);
            msg.textContent = '✅ O email associado a "@' + usuario + '" é: ' + emailOculto;
        } else {
            msg.textContent = '❌ Usuário não encontrado.';
        }
        msg.style.display = 'block';

    } else if (metodo === 'telefone') {
        const ddd = document.getElementById('recDDD').value;
        const tel = document.getElementById('recTelefone').value.trim();
        if (!tel || tel.length < 8) {
            alert('Digite um número de telefone válido.');
            return;
        }
        // TODO: integrar com SMS e buscar no ls
        msg.textContent = '✅ SMS de recuperação enviado para ' + ddd + ' ' + tel;
        msg.style.display = 'block';
    }
}

// Oculta parte do email por segurança (ex: ne***@gmail.com)
function ocultarEmail(email) {
    const [user, domain] = email.split('@');
    const oculto = user.substring(0, 2) + '***';
    return oculto + '@' + domain;
}