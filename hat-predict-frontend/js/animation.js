/* Original SVG choreography. No recreated timing or motion paths. */
(() => {
  const svg = document.querySelector('#original-intro');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelector('#replay').addEventListener('click', () => {
    if (reduced.matches) return;
    svg.setCurrentTime(0);
    svg.unpauseAnimations();
  });
  document.querySelector('#skip-animation').addEventListener('click', () => {
    svg.setCurrentTime(4);
    svg.pauseAnimations();
  });
})();
