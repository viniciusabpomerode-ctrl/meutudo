// Player Lofi Cafe — modo música para estudar/trabalhar
(function() {
  if (!window.location.pathname.includes("/app/")) return;

  const LS_HIDDEN = "afb_lofi_hidden"; // true = completamente oculto
  const LS_OPEN = "afb_lofi_open";     // true = player expandido
  const STATION = "working";

  function createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* ── Setinha de restaurar (aparece quando o botão é fechado) ── */
      .lofi-restore {
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 9997;
        background: rgba(30,30,40,.85);
        color: #888;
        border: none;
        border-top-left-radius: 10px;
        padding: 4px 10px 2px;
        font-size: .7rem;
        cursor: pointer;
        transition: .2s;
        backdrop-filter: blur(6px);
        display: none;
        font-family: inherit;
      }
      .lofi-restore:hover { color: #e0d5c1; background: rgba(40,40,55,.9); }
      .lofi-restore.visible { display: block; }

      /* ── Botão principal ── */
      .lofi-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0;
        border: none;
        border-radius: 30px;
        background: rgba(30,30,40,.92);
        color: #e0d5c1;
        font-size: .85rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,.35);
        transition: .3s;
        backdrop-filter: blur(8px);
        font-family: inherit;
        user-select: none;
        overflow: visible;
      }
      .lofi-btn:hover { background: rgba(40,40,55,.95); }
      .lofi-btn.hidden { display: none; }

      .lofi-btn .play-part {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px 10px 18px;
        border-radius: 30px;
      }
      .lofi-btn .close-part {
        padding: 10px 10px 10px 2px;
        border-radius: 30px;
        opacity: .5;
        transition: .2s;
        font-size: .8rem;
      }
      .lofi-btn .close-part:hover { opacity: 1; color: #ff6b6b; }

      .lofi-btn .indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #555;
        transition: .3s;
      }
      .lofi-btn .indicator.on { background: #7ecf7e; box-shadow: 0 0 8px #7ecf7e; }

      /* ── Player expandido ── */
      .lofi-player {
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 9998;
        background: rgba(25,25,35,.95);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,.08);
        transition: .3s;
        transform-origin: bottom right;
        font-family: inherit;
        width: 360px;
        overflow: hidden;
      }
      .lofi-player.hidden {
        opacity: 0;
        transform: scale(.8) translateY(10px);
        pointer-events: none;
      }
      .lofi-player .lofi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .lofi-player .lofi-header .left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .lofi-player .lofi-header .left span {
        font-size: .82rem;
        color: #b8a99a;
        font-weight: 600;
      }
      .lofi-player .lofi-header .close-btn {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: .9rem;
        padding: 2px 8px;
        border-radius: 6px;
        transition: .2s;
      }
      .lofi-player .lofi-header .close-btn:hover { background: rgba(255,255,255,.08); color: #ccc; }
      .lofi-player iframe {
        border-radius: 10px;
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  function createWidget() {
    const isHidden = localStorage.getItem(LS_HIDDEN) === "true";

    // ── Setinha de restaurar ──
    const restore = document.createElement("button");
    restore.className = `lofi-restore ${isHidden ? 'visible' : ''}`;
    restore.id = "lofi-restore";
    restore.textContent = "◀ LoFi";
    restore.title = "Mostrar LoFi";

    // ── Botão principal ──
    const btn = document.createElement("div");
    btn.className = `lofi-btn ${isHidden ? 'hidden' : ''}`;
    btn.id = "lofi-btn";
    btn.innerHTML = `
      <span class="play-part" id="lofi-playzone">
        <span class="indicator" id="lofi-dot"></span>
        <span>▶</span>
        <span>LoFi</span>
      </span>
      <span class="close-part" id="lofi-btnclose">✕</span>
    `;

    // ── Player expandido ──
    const player = document.createElement("div");
    player.className = "lofi-player hidden";
    player.id = "lofi-player";
    player.innerHTML = `
      <div class="lofi-header">
        <div class="left"><span>🎧 Working · LoFi Cafe</span></div>
        <button class="close-btn" id="lofi-playerclose">✕</button>
      </div>
      <iframe src="https://loficafe.net/embed/${STATION}?utm_source=alemaofacilbrasil&utm_medium=embed"
        width="360" height="80" frameborder="0" allow="autoplay"
        style="border-radius:10px;" loading="lazy"></iframe>
    `;

    document.body.appendChild(restore);
    document.body.appendChild(btn);
    document.body.appendChild(player);

    // ── Clique no play → expande player ──
    document.getElementById("lofi-playzone").addEventListener("click", () => {
      player.classList.toggle("hidden");
      const dot = document.getElementById("lofi-dot");
      dot.classList.toggle("on", !player.classList.contains("hidden"));
    });

    // ── X no botão → esconde tudo, mostra setinha ──
    document.getElementById("lofi-btnclose").addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.add("hidden");
      restore.classList.add("visible");
      player.classList.add("hidden");
      localStorage.setItem(LS_HIDDEN, "true");
    });

    // ── X no player → recolhe player ──
    document.getElementById("lofi-playerclose").addEventListener("click", () => {
      player.classList.add("hidden");
      document.getElementById("lofi-dot").classList.remove("on");
    });

    // ── Setinha → restaura botão ──
    restore.addEventListener("click", () => {
      restore.classList.remove("visible");
      btn.classList.remove("hidden");
      localStorage.setItem(LS_HIDDEN, "false");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { createStyles(); createWidget(); });
  } else {
    createStyles();
    createWidget();
  }
})();
