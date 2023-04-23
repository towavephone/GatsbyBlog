import { memoize } from 'lodash'

export function getDocument () {
  return typeof window !== 'undefined' ? window.document : ({} as any)
}

export function getWindowHeight () {
  return getDocument()?.documentElement?.clientHeight as number
}

type loadScriptOptions = Partial<Omit<HTMLScriptElement, 'src' | 'async'>> & {
  attributesMap?: {
    [key: string]: any
  }
}

// 异步加载单个脚本
async function loadSingleScript (src: string, options: loadScriptOptions = {}) {
  return await new Promise((resolve, reject) => {
    // 这里未考虑到同一 src 同时发起的情况，改用缓存实现
    // if (!id) {
    //   const NAMESPACE = 'c2b16a16-12b3-423a-879f-6b46d1a01d60'
    //   const PREFIX = 'script-id-'
    //   id = PREFIX + uuidv5(src, NAMESPACE)
    // }
    // if (!src || document.querySelector(`#${id}`)) {
    //   return
    // }
    const script: any = document.createElement('script')
    const { attributesMap = {}, ...rest } = options
    Object.keys(rest).forEach((key) => {
      // @ts-expect-error
      script[key] = rest[key]
    })
    Object.keys(attributesMap).forEach((key) => {
      script.setAttribute(key, attributesMap[key])
    })
    script.async = true
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.getElementsByTagName('head')[0].appendChild(script)
  })
}

// 异步加载多个脚本
// memoize 默认情况下用第一个参数作为缓存的 key，即 src
export const loadScript = memoize(loadSingleScript)

// 只支持计算值为正值
export const evaluateCalc = (expression: string, container = getDocument()?.body) => {
  // 不能加以下代码，影响动效
  // if (!container || !Object.keys(container).length) {
  //   return 0
  // }
  // if (!__isBrowser__) {
  //   return 0
  // }
  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.innerHTML = `<div style="width: ${expression}"></div>`
  container.insertBefore(el, container.firstChild)
  const calcPx = el.clientWidth
  container.removeChild(el)
  return calcPx
}

export async function delayFunc(ms: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
