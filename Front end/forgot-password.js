/* ==========================================
   forgot-password.js — NexPath
   Funções da página de recuperação de senha
   ========================================== */


/* ------------------------------------------
   Troca de abas (email / usuário / telefone)
   ------------------------------------------ */

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


/* ------------------------------------------
   Recuperação de conta
   ------------------------------------------ */

function recuperarPor(metodo) {
    const msg = document.getElementById('successMsg');
    msg.style.display = 'none';

    if (metodo === 'email') {
        const email = document.getElementById('recEmail').value.trim();
        if (!email || !email.includes('@')) {
            alert('Digite um email válido.');
            return;
        }
        // TODO: verificar email no banco de dados e enviar link de recuperação
        return;

    } else if (metodo === 'usuario') {
        const usuario = document.getElementById('recUsuario').value.trim();
        if (!usuario) {
            alert('Digite seu nome de usuário.');
            return;
        }
        // TODO: buscar email pelo username no banco de dados
        return;

    } else if (metodo === 'telefone') {
        const ddd = document.getElementById('recDDD').value;
        const tel = document.getElementById('recTelefone').value.trim();
        if (!tel || tel.length < 8) {
            alert('Digite um número de telefone válido.');
            return;
        }
        // TODO: verificar telefone no banco de dados e enviar SMS (ex: Twilio)
        return;
    }
}

// Oculta parte do email por segurança (ex: ne***@gmail.com)
function ocultarEmail(email) {
    const [user, domain] = email.split('@');
    const oculto = user.substring(0, 2) + '***';
    return oculto + '@' + domain;
}