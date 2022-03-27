import React, { useState, useEffect, createContext, FC } from 'react'
import LazyLoad, { ILazyLoadInstance } from 'vanilla-lazyload'

export const LazyLoaderContext = createContext<ILazyLoadInstance | null>(null)
const options = { elements_selector: '.lazy' }

export const LazyLoaderProvider: FC = ({ children }) => {
  const [lazyLoad, setLazyLoad] = useState<ILazyLoadInstance | null>(null)

  useEffect(() => {
    if (!lazyLoad) setLazyLoad(new LazyLoad(options))
    return () => {
      lazyLoad && lazyLoad.destroy()
    }
  }, [lazyLoad])

  return <LazyLoaderContext.Provider value={lazyLoad}>
    {children}
  </LazyLoaderContext.Provider>
}
