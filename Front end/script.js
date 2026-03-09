function calcular(){

let receita = document.getElementById("receita").value;
let despesas = document.getElementById("despesas").value;

receita = Number(receita);
despesas = Number(despesas);

let saldo = receita - despesas;

document.getElementById("saldo").innerText = saldo;

}