/* =============================================================
   SHiFT with Purpose — Acknowledgement of Country Modal
   Shows once per browser session (sessionStorage).
   ============================================================= */
(function () {
  var KEY = 'swp_aoc_seen';
  if (sessionStorage.getItem(KEY)) return;

  var overlay = document.createElement('div');
  overlay.className = 'aoc-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'aoc-heading');

  overlay.innerHTML = [
    '<div class="aoc-modal">',
    '  <div class="aoc-modal__accent"></div>',
    '  <div class="aoc-modal__body">',
    '    <p class="aoc-modal__eyebrow">Acknowledgement of Country</p>',
    '    <h2 class="aoc-modal__heading" id="aoc-heading">We begin by acknowledging Country.</h2>',
    '    <p class="aoc-modal__text">We acknowledge the Bunurong people of the Kulin Nation as the Traditional Custodians of the land where we live and work, and honour the Indigenous peoples of the lands of Buenos Aires, Argentina, where our founder was raised.</p>',
    '    <p class="aoc-modal__text">We pay our respects to Elders past and present and recognise the value, dignity, and lived experience of all people; particularly those too often excluded from design, access, opportunity, and decision-making.</p>',
    '  </div>',
    '  <div class="aoc-modal__footer">',
    '    <button class="aoc-modal__btn" id="aoc-close">Acknowledge &amp; continue</button>',
    '  </div>',
    '</div>'
  ].join('');

  function close() {
    sessionStorage.setItem(KEY, '1');
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s ease';
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 260);
  }

  document.getElementById('aoc-close') && document.getElementById('aoc-close').addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  // Append after DOM is ready
  if (document.body) {
    document.body.appendChild(overlay);
    // Bind button after append (since innerHTML creates elements before append)
    var btn = document.getElementById('aoc-close');
    if (btn) btn.addEventListener('click', close);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(overlay);
      var btn = document.getElementById('aoc-close');
      if (btn) btn.addEventListener('click', close);
    });
  }
})();
