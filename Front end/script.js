function calcular() {

    let receita = document.getElementById("receita").value;
    let despesas = document.getElementById("despesas").value;

    receita = Number(receita);
    despesas = Number(despesas);

    let saldo = receita - despesas;

    document.getElementById("saldo").innerText = saldo;

}

function abrirTermos() {
    document.getElementById("popup-termos").style.display = "flex";
}

function fecharTermos() {
    document.getElementById("popup-termos").style.display = "none";
}

function validarRegistro() {

    let nome = document.getElementById("nome");
    let email = document.getElementById("email");
    let senha = document.getElementById("senha");
    let confirmar = document.getElementById("confirmarSenha");
    let nascimento = document.getElementById("nascimento");
    let termos = document.getElementById("terms");

    // Limpar mensagens prévias
    senha.setCustomValidity('');
    confirmar.setCustomValidity('');
    nascimento.setCustomValidity('');
    termos.setCustomValidity('');

    // Validações de senha
    let senhaValor = senha.value;
    if (senhaValor === "" || senhaValor.length < 8) {
        senha.setCustomValidity("A senha precisa ter no mínimo 8 caracteres.");
        senha.reportValidity();
        return false;
    }

    // Verificar se tem símbolo
    let temSimbolo = false;
    const simbolos = "!@#$%^&*()_+-=[]{};\':\",./<>?|\\`~";
    for (let i = 0; i < senhaValor.length; i++) {
        if (simbolos.includes(senhaValor[i])) {
            temSimbolo = true;
            break;
        }
    }
    if (!temSimbolo) {
        senha.setCustomValidity("A senha precisa conter um símbolo! Exemplo: ! @ # $ % ^ & * ( )");
        senha.reportValidity();
        return false;
    }

    // Não permitir espaços
    if (/\s/.test(senhaValor)) {
        senha.setCustomValidity("A senha não pode conter espaços.");
        senha.reportValidity();
        return false;
    }

    // Validar confirmação de senha
    if (senhaValor !== confirmar.value) {
        confirmar.setCustomValidity("As senhas não são iguais.");
        confirmar.reportValidity();
        return false;
    }

    // Verificar campos obrigatórios
    if (nome.value.trim() === "" || email.value.trim() === "" || confirmar.value === "" || nascimento.value === "") {
        if (nome.value.trim() === "") nome.reportValidity();
        else if (email.value.trim() === "") email.reportValidity();
        else if (confirmar.value === "") confirmar.reportValidity();
        else if (nascimento.value === "") nascimento.reportValidity();
        return false;
    }

    // Validar email
    if (!email.value.includes("@")) {
        email.setCustomValidity("Digite um email válido.");
        email.reportValidity();
        return false;
    }

    // Validar data de nascimento
    const hoje = new Date();
    const dataNasc = new Date(nascimento.value);

    if (isNaN(dataNasc.getTime())) {
        nascimento.setCustomValidity("Data de nascimento inválida.");
        nascimento.reportValidity();
        return false;
    }

    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    if (idade < 10) {
        nascimento.setCustomValidity("É necessário ter pelo menos 10 anos para criar uma conta.");
        nascimento.reportValidity();
        return false;
    }

    // Validar termos
    if (!termos.checked) {
        termos.setCustomValidity("Você precisa aceitar os termos de uso.");
        termos.reportValidity();
        return false;
    }

    // Se passou em todas as validações
    alert("Cadastro válido!");
    return true;

}

/* login */

// set up listeners when DOM is ready
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

    alert("Login válido (backend ainda não conectado)");
    return true;

}