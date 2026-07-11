// Utilitarios de microinteracao — contador animado, ripple, stagger.
// CSS faz o trabalho pesado (assets/css/style.css, classes .mi-*); aqui so
// o que precisa de JS (numeros contando, ripple no clique, delay em cascata).

function miAnimateNumber(el, target, duration) {
  duration = duration || 1200;
  if (!el) return;
  const start = performance.now();
  let done = false;
  function step(t) {
    if (done) return;
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target).toLocaleString("pt-BR");
    if (p < 1) requestAnimationFrame(step);
    else done = true;
  }
  requestAnimationFrame(step);
  // Rede de seguranca: se a aba estiver em segundo plano o
  // requestAnimationFrame pode ser pausado pelo navegador — garante que o
  // numero final sempre aparece certo, mesmo sem a animacao completa.
  setTimeout(() => {
    if (!done) { done = true; el.textContent = target.toLocaleString("pt-BR"); }
  }, duration + 150);
}

function miRipple(el) {
  if (!el) return;
  el.classList.add("mi-ripple");
  const r = document.createElement("span");
  r.className = "mi-ripple-el";
  const size = Math.max(el.offsetWidth, el.offsetHeight) * 1.4;
  r.style.width = r.style.height = size + "px";
  r.style.left = "50%";
  r.style.top = "50%";
  r.style.marginLeft = -size / 2 + "px";
  r.style.marginTop = -size / 2 + "px";
  el.appendChild(r);
  setTimeout(() => r.remove(), 550);
}

// Aplica delay incremental (stagger) a uma lista de elementos .mi-stagger
function miStagger(selector, container, stepMs) {
  stepMs = stepMs || 70;
  const root = container || document;
  root.querySelectorAll(selector).forEach((el, i) => {
    el.style.animationDelay = i * stepMs + "ms";
  });
}
