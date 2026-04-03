/* ==========================================
   login.js — NexPath
   Validação do formulário de login
   ========================================== */

function validarLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

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

    // TODO: enviar credenciais para o backend
    return false;
}