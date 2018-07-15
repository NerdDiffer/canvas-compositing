// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing/Example

(() => {
  // GCO = global compositing operation
  const GCO_DATA = {
    types: [
      'source-over','source-in','source-out','source-atop',
      'destination-over','destination-in','destination-out','destination-atop',
      'lighter', 'copy','xor', 'multiply', 'screen', 'overlay', 'darken',
      'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
      'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
    ].reverse(),
    texts: [
      'This is the default setting and draws new shapes on top of the existing canvas content.',
      'The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.',
      'The new shape is drawn where it doesn\'t overlap the existing canvas content.',
      'The new shape is only drawn where it overlaps the existing canvas content.',
      'New shapes are drawn behind the existing canvas content.',
      'The existing canvas content is kept where both the new shape and existing canvas content overlap. Everything else is made transparent.',
      'The existing content is kept where it doesn\'t overlap the new shape.',
      'The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.',
      'Where both shapes overlap the color is determined by adding color values.',
      'Only the new shape is shown.',
      'Shapes are made transparent where both overlap and drawn normal everywhere else.',
      'The pixels are of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.',
      'The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)',
      'A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.',
      'Retains the darkest pixels of both layers.',
      'Retains the lightest pixels of both layers.',
      'Divides the bottom layer by the inverted top layer.',
      'Divides the inverted bottom layer by the top layer, and then inverts the result.',
      'A combination of multiply and screen like overlay, but with top and bottom layer swapped.',
      'A softer version of hard-light. Pure black or white does not result in pure black or white.',
      'Subtracts the bottom layer from the top layer or the other way round to always get a positive value.',
      'Like difference, but with lower contrast.',
      'Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.',
      'Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.',
      'Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.',
      'Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.'
    ].reverse(),
  };

  const createInterlacePattern = (size, color1, color2) => {
    const proto = document.createElement('canvas').getContext('2d');

    proto.canvas.width = size * 2;
    proto.canvas.height = size * 2;

    proto.fillStyle = color1; // top-left
    proto.fillRect(0, 0, size, size);

    proto.fillStyle = color2; // top-right
    proto.fillRect(size, 0, size, size);

    proto.fillStyle = color2; // bottom-left
    proto.fillRect(0, size, size, size);

    proto.fillStyle = color1; // bottom-right
    proto.fillRect(size, size, size, size);

    const pattern = proto.createPattern(proto.canvas, 'repeat');
    pattern.data = proto.canvas.toDataURL();

    return pattern;
  };

  const OP_8X8 = createInterlacePattern(8, '#FFF', '#eee');

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

  const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas'); 

    canvas.style.background = `url('${OP_8X8.data}')`;
    canvas.style.border = '1px solid #000';
    canvas.style.margin = '5px';

    canvas.width = width / 2;
    canvas.height = height / 2;

    return canvas;
  };

  const drawExisting = (existingContentCanvas, width, height) => {
    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(existingContentCanvas, 0, 0, width/2, height/2);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, height/2 - 20, width/2, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = '14px arial';
    ctx.fillText('existing content', 5, height/2 - 5);
    ctx.restore();

    return canvas;
  };

  const drawNewContent = (newContentCanvas, width, height) => {
    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(newContentCanvas, 0, 0, width/2, height/2);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, height/2 - 20, width/2, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = '14px arial';
    ctx.fillText('new content', 5, height/2 - 5);
    ctx.restore();

    return canvas;
  };

  const drawResult = (existingContentCanvas, newContentCanvas, width, height, gcoType) => {
    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height)
    ctx.save();
    ctx.drawImage(existingContentCanvas, 0, 0, width/2, height/2);
    ctx.globalCompositeOperation = gcoType;
    ctx.drawImage(newContentCanvas, 0, 0, width/2, height/2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, height/2 - 20, width/2, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = '14px arial';
    ctx.fillText(gcoType, 5, height/2 - 5);
    ctx.restore();

    return canvas;
  };

  const runComposite = (existingContentCanvas, newContentCanvas, width, height) => {
    const dl = document.createElement('dl');
    document.body.appendChild(dl);

    while(GCO_DATA.types.length) {
      const gcoType = GCO_DATA.types.pop();
      const dt = document.createElement('dt');
      dt.textContent = gcoType;
      dl.appendChild(dt);
      const dd = document.createElement('dd');
      const p = document.createElement('p');
      p.textContent = GCO_DATA.texts.pop();
      dd.appendChild(p);

      const canvasToDrawOn = drawExisting(existingContentCanvas, width, height)
      const canvasToDrawFrom = drawNewContent(newContentCanvas, width, height);
      const canvasToDrawResult = drawResult(existingContentCanvas, newContentCanvas, width, height, gcoType);

      dd.appendChild(canvasToDrawOn);
      dd.appendChild(canvasToDrawFrom);
      dd.appendChild(canvasToDrawResult);

      dl.appendChild(dd);
    }
  };

  window.onload = () => {
    const lum = { r: 0.33, g: 0.33, b: 0.33 }; // lum in sRGB
    const width = 320;
    const height = 340;

    const existingContentCanvas = document.createElement('canvas');
    existingContentCanvas.width = width;
    existingContentCanvas.height = height;

    const newContentCanvas = document.createElement('canvas');
    newContentCanvas.width = width;
    newContentCanvas.height = height;

    colorSphere(existingContentCanvas);
    mixLight(newContentCanvas);
    runComposite(existingContentCanvas, newContentCanvas, width, height);

    return;
  };
})();
