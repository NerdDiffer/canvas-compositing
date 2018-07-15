((utils) => {
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

  const drawCombinedResult = (existingContentCanvas, newContentCanvas, width, height, gcoType) => {
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

  const newGcoLabel = (gcoType) => {
    const dt = document.createElement('dt');
    dt.textContent = gcoType;
    return dt;
  };

  const initExistingAndNewCanvas = (width, height) => {
    const existingContentCanvas = createCanvas(width * 2, height * 2);
    utils.colorSphere(existingContentCanvas);

    const newContentCanvas = createCanvas(width * 2, height * 2);
    utils.mixLight(newContentCanvas);

    return { existingContentCanvas, newContentCanvas };
  };

  const newGcoDetails = (gcoType, gcoText, width, height) => {
    const dd = document.createElement('dd');

    const p = document.createElement('p');
    p.textContent = gcoText;
    dd.appendChild(p);

    const {
      existingContentCanvas,
      newContentCanvas,
    } = initExistingAndNewCanvas(width, height);

    const canvasToDrawOn = drawExisting(existingContentCanvas, width, height)
    const canvasToDrawFrom = drawNewContent(newContentCanvas, width, height);
    const canvasToDrawResult = drawCombinedResult(existingContentCanvas, newContentCanvas, width, height, gcoType);

    dd.appendChild(canvasToDrawOn);
    dd.appendChild(canvasToDrawFrom);
    dd.appendChild(canvasToDrawResult);

    return dd;
  }

  const compositeList = (width, height) => {
    const dl = document.createElement('dl');

    for (let i = GCO_DATA.types.length - 1; i >= 0; i--) {
      const gcoType = GCO_DATA.types[i];
      const gcoText = GCO_DATA.texts[i];

      const dt = newGcoLabel(gcoType)
      dl.appendChild(dt);

      const dd = newGcoDetails(gcoType, gcoText, width, height);
      dl.appendChild(dd);
    }

    return dl;
  };

  window.compositeList = compositeList;
})({ colorSphere: window.colorSphere, mixLight: window.mixLight });
