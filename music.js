(() => {
  const audio = document.querySelector('#music');
  const toggle = document.querySelector('#music-toggle');
  let activated = false;
  let fade;
  function sync() {
    const playing = !audio.paused;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
    toggle.title = playing ? '暂停音乐' : '播放音乐';
    toggle.textContent = playing ? '♫' : '♪';
  }
  async function play() {
    clearInterval(fade);
    audio.volume = 0;
    try {
      await audio.play();
      fade = setInterval(() => {
        audio.volume = Math.min(0.4, audio.volume + 0.02);
        if (audio.volume >= 0.4) clearInterval(fade);
      }, 75);
    } catch {
      toggle.title = '点击播放音乐';
    }
    sync();
  }
  document.querySelector('#scene').addEventListener('pointerdown', event => {
    if (activated || event.target.closest('#music-toggle')) return;
    activated = true;
    play();
  });
  document.querySelector('#next').addEventListener('click', () => {
    if (!activated) { activated = true; play(); }
  });
  toggle.addEventListener('click', () => {
    activated = true;
    if (audio.paused) play();
    else { clearInterval(fade); audio.pause(); }
  });
  audio.addEventListener('ended', () => { audio.currentTime = 0; play(); });
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
})();
