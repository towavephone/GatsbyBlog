export function ready(callback: any) {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.readyState !== 'loading') callback();
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  else {
    // @ts-expect-error
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') callback();
    });
  }
}

ready(function() {
  const svgNode = document.createElement('div');
  svgNode.style.height = String(0);
  svgNode.style.width = String(0);
  svgNode.style.position = 'absolute';
  svgNode.style.visibility = 'hidden';
  svgNode.setAttribute('aria-hidden', 'true');
  svgNode.innerHTML = `<svg>
    <symbol id="icon-title-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" class="design-iconfont"><path d="M8.53362136,4.33783991 L30,25.7448399 L51.4663786,4.33783991 L60,4.33783991 L34.267,29.9998399 L60,55.6621601 L51.4663786,55.6621601 L30,34.2548399 L8.53362136,55.6621601 L2.27373675e-13,55.6621601 L25.733,29.9998399 L2.27373675e-13,4.33783991 L8.53362136,4.33783991 Z" fill-rule="evenodd"></path></symbol>
  </svg>`;

  if (document.body.firstChild) {
    document.body.insertBefore(svgNode, document.body.firstChild);
  } else {
    document.body.appendChild(svgNode);
  }
});
