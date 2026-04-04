/* ------------------------------------------
   INDEX — Cálculo de saldo
   ------------------------------------------ */

function calcular() {
  const receita = Number(document.getElementById("receita").value);
  const despesas = Number(document.getElementById("despesas").value);
  const saldo = receita - despesas;
  const el = document.getElementById("saldo");
  el.innerText = saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  el.style.color = saldo >= 0 ? "var(--cyan-neon)" : "#f87171";
}

/* ------------------------------------------
   INDEX — Chat demo do Nexlos
   ------------------------------------------ */

const respostasDemo = [
  "Com base nos seus dados, você está gastando mais do que deveria em lazer. Que tal definir um limite mensal?",
  "Sua reserva de emergência deveria cobrir ao menos 3 meses de despesas. Vamos calcular quanto você precisa guardar?",
  "Identificamos que suas despesas fixas representam 70% da sua renda. O ideal é manter abaixo de 50%.",
  "Dica: automatize suas economias transferindo um valor fixo todo dia de pagamento. Consistência é chave!",
  "Para atingir sua meta financeira, você precisaria economizar R$ 500 por mês durante 12 meses.",
];

let respostaIdx = 0;

function enviarChat(event) {
  if (event && event.type === "keydown" && event.key !== "Enter") return;

  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const texto = input.value.trim();

  if (!texto) return;

  // Mensagem do usuário
  const msgUser = document.createElement("p");
  msgUser.innerHTML =
    '<strong style="color: var(--blue-bright)">Você:</strong> ' + texto;
  chatBox.appendChild(msgUser);

  input.value = "";

  // Resposta do Nexlos com delay
  setTimeout(() => {
    const msgIA = document.createElement("p");
    msgIA.innerHTML =
      '<strong style="color: var(--cyan-neon)">Nexlos:</strong> ' +
      respostasDemo[respostaIdx % respostasDemo.length];
    chatBox.appendChild(msgIA);
    chatBox.scrollTop = chatBox.scrollHeight;
    respostaIdx++;
  }, 800);

  chatBox.scrollTop = chatBox.scrollHeight;
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

/* ------------------------------------------
   GLOBAL — Scroll Reveal com Intersection Observer
   Adicione a classe "reveal" em qualquer elemento
   para ele aparecer com animação ao entrar na tela
   ------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".reveal");

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado para elementos filhos próximos
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12, // aparece quando 12% do elemento está visível
      rootMargin: "0px 0px -40px 0px", // começa um pouco antes do fim da tela
    },
  );

  // Adiciona delay escalonado automaticamente para cards em grade
  elementos.forEach((el, i) => {
    // Se for feature-card, escalonar o delay entre eles
    if (el.classList.contains("feature-card")) {
      el.dataset.delay = (i % 3) * 100;
    }
    observer.observe(el);
  });
});
