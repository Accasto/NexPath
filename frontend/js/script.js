/* FUNÇÕES GLOBAIS */

/* ------------------------------------------
   INDEX — Cálculo de saldo
   ------------------------------------------ */

function calcular() {
    let receita = Number(document.getElementById("receita").value);
    let despesas = Number(document.getElementById("despesas").value);
    let saldo = receita - despesas;
    document.getElementById("saldo").innerText = saldo;
}


/* ------------------------------------------
   REGISTER — Popup de termos de uso
   ------------------------------------------ */

function abrirTermos() {
    document.getElementById("popup-termos").style.display = "flex";
}

function fecharTermos() {
    document.getElementById("popup-termos").style.display = "none";
}