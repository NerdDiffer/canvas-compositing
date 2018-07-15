(() => {
  // HSV (1978) = H: Hue / S: Saturation / V: Value
  const colorHSV_RGB = (obj) => {
    let H = obj.H / 360;
    let S = obj.S / 100;
    let V = obj.V / 100;

    let R, G, B; // colors
    let A, C, D; // ???

    if (S == 0) {
      R = G = B = Math.round(V * 255);
    } else {
      if (H >= 1) H = 0;

      H = 6 * H;
      D = H - Math.floor(H);
      A = Math.round(255 * V * (1 - S));
      B = Math.round(255 * V * (1 - (S * D)));
      C = Math.round(255 * V * (1 - (S * (1 - D))));
      V = Math.round(255 * V);

      switch (Math.floor(H)) {
        case 0:
          R = V;
          G = C;
          B = A;
          break;
        case 1:
          R = B;
          G = V;
          B = A;
          break;
        case 2:
          R = A;
          G = V;
          B = C;
          break;
        case 3:
          R = A;
          G = B;
          B = V;
          break;
        case 4:
          R = C;
          G = A;
          B = V;
          break;
        case 5:
          R = V;
          G = A;
          B = B;
          break;
        default: 
          'uh oh'
      }
    }

    return { R, G, B };
  };

  const colorSphere = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = 360;
    const halfWidth = width / 2;
    const rotate = (1 / 360) * Math.PI * 2; // per degree
    const offset = 0; // scrollbar offset
    const oleft = -20;
    const otop = -20;

    for (let n = 0; n < 360; n++) {
      const gradient = ctx.createLinearGradient(
        oleft + halfWidth,
        otop,
        oleft + halfWidth,
        otop + halfWidth
      );

      const color = colorHSV_RGB({ H: (n + 300) % 360, S: 100, V: 100 });

      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.7, `rgba(${color.R}, ${color.G}, ${color.B}, 1)`);
      gradient.addColorStop(1, 'rgba(255,255,255,1)');

      ctx.beginPath();
      ctx.moveTo(oleft + halfWidth, otop);
      ctx.lineTo(oleft + halfWidth, otop + halfWidth);
      ctx.lineTo(oleft + halfWidth + 6, otop);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.translate(oleft + halfWidth, otop + halfWidth);
      ctx.rotate(rotate);
      ctx.translate(-(oleft + halfWidth), -(otop + halfWidth));
    }

    ctx.beginPath();
    ctx.fillStyle = '#00f';
    ctx.fillRect(15,15,30,30)
    ctx.fill();

    return ctx.canvas;
  };

  window.colorSphere = colorSphere;
})();
