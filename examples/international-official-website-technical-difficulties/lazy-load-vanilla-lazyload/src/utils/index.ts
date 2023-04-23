export function getDocument () {
  return typeof window !== 'undefined' ? window.document : ({} as any)
}

export function getWindowHeight () {
  return getDocument()?.documentElement?.clientHeight as number
}
