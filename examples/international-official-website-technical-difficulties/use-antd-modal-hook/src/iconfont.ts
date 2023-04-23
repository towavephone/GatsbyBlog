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
    <symbol id="icon-cancel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="design-iconfont"><path d="M12,2.25 C17.3847763,2.25 21.75,6.61522369 21.75,12 C21.75,17.3847763 17.3847763,21.75 12,21.75 C6.61522369,21.75 2.25,17.3847763 2.25,12 C2.25,6.61522369 6.61522369,2.25 12,2.25 Z M14.9440275,8.02725212 L14.7837867,8.09310273 L11.9986528,10.875 L9.21615811,8.09312276 L9.0558973,8.02725212 L6.91099413,8.03858674 L10.8736528,11.9985 L6.91114656,15.9614141 L9.0558973,15.9727479 L9.21615817,15.9068772 L11.9986528,13.1235 L14.7837867,15.9068972 L14.9440275,15.9727479 L17.0888534,15.9614137 L13.1236528,11.9985 L17.0890059,8.03858714 L14.9440275,8.02725212 Z" fill-rule="evenodd"></path></symbol>
  </svg>`;

  if (document.body.firstChild) {
    document.body.insertBefore(svgNode, document.body.firstChild);
  } else {
    document.body.appendChild(svgNode);
  }
});
