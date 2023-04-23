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
    <symbol id="icon-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="design-iconfont"><path fill-rule="nonzero" d="M5.80719907 3.80711379L20.1928009 12 5.80719907 20.1928862 5.8064448 17.8891138 16.1526706 12 7.80767063 7.247 7.8074448 14.4481138 5.8064448 15.5871138z"></path></symbol>
    <symbol id="icon-window-closed-hover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="design-iconfont">
      <path d="M16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 Z M21.4839278,8.99619005 L15.9993333,14.40819 L10.5160722,8.99619005 L9.33333333,10.1789289 L14.8093333,15.58319 L9.3333333,20.9877378 L10.5160722,22.1704766 L15.9993333,16.75819 L21.4839278,22.1704766 L22.6666667,20.9877378 L17.1903333,15.58319 L22.6666667,10.1789289 L21.4839278,8.99619005 Z" transform="matrix(-1 0 0 1 32 0)" fill-rule="nonzero"></path>
    </symbol>
    <symbol id="icon-window-closed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="design-iconfont">
      <g fill-rule="nonzero">
        <path d="M21.4839278,8.99619005 L22.6666667,10.1789289 L17.1903333,15.58319 L22.6666667,20.9877378 L21.4839278,22.1704766 L15.9993333,16.75819 L10.5160722,22.1704766 L9.3333333,20.9877378 L14.8093333,15.58319 L9.33333333,10.1789289 L10.5160722,8.99619005 L15.9993333,14.40819 L21.4839278,8.99619005 Z"></path>
        <path d="M16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 Z M16,1 C7.71572875,1 1,7.71572875 1,16 C1,24.2842712 7.71572875,31 16,31 C24.2842712,31 31,24.2842712 31,16 C31,7.71572875 24.2842712,1 16,1 Z" opacity=".6"></path>
      </g>
    </symbol>
  </svg>`;

  if (document.body.firstChild) {
    document.body.insertBefore(svgNode, document.body.firstChild);
  } else {
    document.body.appendChild(svgNode);
  }
});
