/* ==========================================
   script.js — NexPath
   Funções globais compartilhadas entre páginas
   ========================================== */


/* ------------------------------------------
   GLOBAL — Popup estilizado
   Substitui os alert() do navegador
   Tipos: 'sucesso', 'erro', 'aviso'
   Uso: mostrarPopup('mensagem', 'tipo', callbackAoFechar)
   ------------------------------------------ */

function mostrarPopup(mensagem, tipo, callback) {
  tipo = tipo || 'aviso';
  const popup = document.getElementById('nexpath-popup');
  const icone = document.getElementById('popup-icon');
  const msg = document.getElementById('popup-mensagem');

  if (!popup) return;

  const icones = { sucesso: '✅', erro: '❌', aviso: '⚠️' };
  icone.textContent = icones[tipo] || '⚠️';
  msg.textContent = mensagem;
  popup._callback = callback || null;
  popup.classList.add('ativo');
}

function fecharPopup() {
  const popup = document.getElementById('nexpath-popup');
  if (!popup) return;
  popup.classList.remove('ativo');
  if (typeof popup._callback === 'function') {
    popup._callback();
    popup._callback = null;
  }
}


/* ------------------------------------------
   REGISTER — Popup de termos de uso
   ------------------------------------------ */

function abrirTermos() {
  document.getElementById('popup-termos').style.display = 'flex';
}

function fecharTermos() {
  document.getElementById('popup-termos').style.display = 'none';
}


/* ------------------------------------------
   GLOBAL — Partículas animadas no fundo
   ------------------------------------------ */

(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const CONFIG = {
    count: 60,
    maxDist: 140,
    speed: 0.35,
    dotColor: 'rgba(56, 189, 248, ',
    lineColor: 'rgba(56, 189, 248, ',
    dotSize: 1.8,
  };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * CONFIG.dotSize + 0.8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.dotColor + '0.6)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();


/* ------------------------------------------
   GLOBAL — Scroll Reveal
   ------------------------------------------ */

document.addEventListener('DOMContentLoaded', function () {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elementos.forEach(function (el, i) {
    if (el.classList.contains('feature-card')) {
      el.dataset.delay = (i % 3) * 120;
    }
    observer.observe(el);
  });
});