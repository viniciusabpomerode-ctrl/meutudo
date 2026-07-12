// Rotacao de conteudo: prioriza o que a pessoa ainda nao viu (Quiz, Escrita,
// Sessao rapida). Quando ela ja viu tudo de um assunto, reinicia o ciclo e
// volta a repetir -- sensacao de aprendizado constante em vez de ficar
// travado nas mesmas 10 perguntas sempre.
const ContentRotation = (() => {
  function key(ns) { return "afb_seen_" + ns; }

  function seenSet(ns) {
    try { return new Set(JSON.parse(localStorage.getItem(key(ns)) || "[]")); }
    catch { return new Set(); }
  }

  function markSeen(ns, id) {
    const s = seenSet(ns);
    s.add(String(id));
    try { localStorage.setItem(key(ns), JSON.stringify([...s])); } catch {}
  }

  function markManySeen(ns, ids) {
    const s = seenSet(ns);
    ids.forEach(id => s.add(String(id)));
    try { localStorage.setItem(key(ns), JSON.stringify([...s])); } catch {}
  }

  // items: array de qualquer coisa; idFn: (item) => string estavel.
  // Devolve os itens ainda nao vistos; se acabou (viu tudo), reinicia o
  // ciclo (limpa o historico) e devolve a lista inteira de novo.
  function unseenPool(ns, items, idFn) {
    const seen = seenSet(ns);
    const unseen = items.filter(it => !seen.has(String(idFn(it))));
    if (unseen.length > 0) return unseen;
    try { localStorage.removeItem(key(ns)); } catch {}
    return items;
  }

  function reset(ns) { try { localStorage.removeItem(key(ns)); } catch {} }

  return { unseenPool, markSeen, markManySeen, reset };
})();
