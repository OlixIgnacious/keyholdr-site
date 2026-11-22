// Copy buttons on code blocks: <button class="copy-btn" data-copy-target="id">.
document.querySelectorAll('.copy-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var target = document.getElementById(btn.getAttribute('data-copy-target'));
    if (!target || !navigator.clipboard) return;
    navigator.clipboard.writeText(target.textContent).then(function () {
      var original = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.setAttribute('data-copied', 'true');
      setTimeout(function () {
        btn.textContent = original;
        btn.removeAttribute('data-copied');
      }, 1800);
    });
  });
});
