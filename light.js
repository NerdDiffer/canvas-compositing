(() => {
  const mixLight = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(100, 200, 100, Math.PI*2, 0, false);
    ctx.fill()

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,255,1)';
    ctx.arc(220, 200, 100, Math.PI*2, 0, false);
    ctx.fill()

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,255,0,1)';
    ctx.arc(160, 100, 100, Math.PI*2, 0, false);
    ctx.fill();

    ctx.restore(); // TODO: is this necessary?

    ctx.beginPath();
    ctx.fillStyle = '#f00';
    ctx.fillRect(0,0,30,30)
    ctx.fill();
  };

  window.mixLight = mixLight;
})();
