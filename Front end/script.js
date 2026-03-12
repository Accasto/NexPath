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

    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value;
    let confirmar = document.getElementById("confirmarSenha").value;
    let nascimento = document.getElementById("nascimento").value;
    let termos = document.getElementById("terms").checked;

    // validações específicas da senha primeiro (mesmo que outros campos estejam vazios)
    if (senha === "" || senha.length < 8) {
        alert("A senha precisa ter no mínimo 8 caracteres.");
        return false;
    }
    // não permitir espaços
    if (/\s/.test(senha)) {
        alert("A senha não pode conter espaços.");
        return false;
    }
    // apenas letras, números e símbolos aprovados
    const allowedRegex = /^[A-Za-z0-9!@#$%^&*(),.?":{}<>\[\]\/\\~`';:\-_+=]+$/;
    if (!allowedRegex.test(senha)) {
        alert("A senha contém caracteres inválidos.");
        return false;
    }
    // apenas caracteres especiais comuns
    const specialRegex = /[!@#$%^&*(),.?":{}<>\[\]\/\\~`';:\-_+=]/;
    if (!specialRegex.test(senha)) {
        alert("A senha precisa conter pelo menos um caractere especial.");
        return false;
    }
    if (senha !== confirmar) {
        alert("As senhas não são iguais.");
        return false;
    }

    // agora a verificação geral de campos
    if (nome === "" || email === "" || confirmar === "" || nascimento === "") {
        alert("Preencha todos os campos.");
        return false;
    }

    if (!email.includes("@")) {
        alert("Digite um email válido.");
        return false;
    }

    // calcular idade mínima de 10 anos
    const hoje = new Date();
    const dataNasc = new Date(nascimento);
    
    // validar data
    if (isNaN(dataNasc.getTime())) {
        alert("Data de nascimento inválida.");
        return false;
    }
    
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    if (idade < 10) {
        alert("É necessário ter pelo menos 10 anos para criar uma conta.");
        return false;
    }

    if (!termos) {
        alert("Você precisa aceitar os termos de uso.");
        return false;
    }

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
        alert("Senha inválida.");
        return false;
    }

    alert("Login válido (backend ainda não conectado)");
    return true;

}