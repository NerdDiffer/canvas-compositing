// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing/Example

((compositeList) => {
  window.onload = () => {
    const width = 320;
    const height = 340;

    const dl = compositeList(width, height);
    document.body.appendChild(dl);
  };
})(window.compositeList);
