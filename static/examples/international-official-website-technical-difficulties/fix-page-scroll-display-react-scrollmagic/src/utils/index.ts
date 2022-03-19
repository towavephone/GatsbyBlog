export function getDocument() {
  return typeof window !== 'undefined' ? window.document : {};
}

export function getWindowHeight() {
  return getDocument().documentElement.clientHeight;
}
