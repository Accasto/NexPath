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

    if (nome === "" || email === "" || senha === "" || confirmar === "" || nascimento === "") {
        alert("Preencha todos os campos.");
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

    if (senha !== confirmar) {
        alert("As senhas não coincidem.");
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