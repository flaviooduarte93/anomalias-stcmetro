// ── STCMETRO — Tema do Modal de Apontamento ──
(function () {
  var KEY   = 'stcmetro-modal-tema';
  var MODAL = 'modalAnomalia';

  var style = document.createElement('style');
  style.textContent = [
    '#modalAnomalia.mt-light .modal{background:#F4F7FC!important;color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light .modal-handle{background:#D9E3F5!important;}',

    /* Título — seletores múltiplos para garantir especificidade */
    '#modalAnomalia.mt-light .modal-title{color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .modal-title *{color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .modal-title span{color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .modal-title > div > span{color:#2F5FE3!important;}',

    '#modalAnomalia.mt-light .modal-label{color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .modal-value{background:#fff!important;border-color:#D9E3F5!important;color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light .modal-value.loading{color:#A0B3D0!important;}',
    '#modalAnomalia.mt-light input[type=text],#modalAnomalia.mt-light textarea{background:#fff!important;border-color:#D9E3F5!important;color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light input[type=text]::placeholder,#modalAnomalia.mt-light textarea::placeholder{color:#A0B3D0!important;}',
    '#modalAnomalia.mt-light .tipo-btn{background:#fff!important;border-color:#D9E3F5!important;color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light .tipo-btn.selected{border-color:#2F5FE3!important;background:#EEF3FF!important;color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .foto-upload-btn{background:#fff!important;border-color:#D9E3F5!important;color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light #camposExtras input,#modalAnomalia.mt-light #camposExtras select,#modalAnomalia.mt-light #camposExtras textarea{background:#fff!important;border-color:#D9E3F5!important;color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light #camposExtras label,#modalAnomalia.mt-light #camposExtras .modal-label{color:#2F5FE3!important;}',
    '#modalAnomalia.mt-light .btn-cancel{background:#f0f4ff!important;border-color:#D9E3F5!important;color:#8FA3C8!important;}',
    '#modalAnomalia.mt-light .btn-save:not([disabled]){background:#1B2B5A!important;color:#fff!important;border-color:#1B2B5A!important;}',
    '#modalAnomalia.mt-light .btn-save[disabled]{background:#c8d4ec!important;color:#8FA3C8!important;border-color:#c8d4ec!important;}',
    '#modalAnomalia.mt-light #maBtnSun{display:none!important;}',
    '#modalAnomalia.mt-light #maBtnMoon{display:block!important;}',
    '#modalAnomalia:not(.mt-light) #maBtnSun{display:block!important;}',
    '#modalAnomalia:not(.mt-light) #maBtnMoon{display:none!important;}',
  ].join('');
  document.head.appendChild(style);

  function set(tema) {
    var modal = document.getElementById(MODAL);
    if (!modal) return;
    modal.classList.toggle('mt-light', tema === 'light');

    // Força cor do título via JS também (garante sobrescrever qualquer inline style)
    var titleSpan = modal.querySelector('.modal-title span');
    if (titleSpan) {
      titleSpan.style.color = tema === 'light' ? '#2F5FE3' : '';
    }

    try { localStorage.setItem(KEY, tema); } catch(e) {}
  }

  function toggle() {
    var modal = document.getElementById(MODAL);
    if (!modal) return;
    set(modal.classList.contains('mt-light') ? 'dark' : 'light');
  }

  window.modalTheme = { set: set, toggle: toggle };

  function init() {
    var saved = 'dark';
    try { saved = localStorage.getItem(KEY) || 'dark'; } catch(e) {}
    set(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
