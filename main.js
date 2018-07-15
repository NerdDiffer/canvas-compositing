// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing/Example

((
  colorSphere,
  mixLight,
  runComposite,
) => {
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
})(
  window.colorSphere,
  window.mixLight,
  window.runComposite,
);
