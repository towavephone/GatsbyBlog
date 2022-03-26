import { useEffect, useState } from 'react'
import { useSize } from 'ahooks'

const useStoreContext = () => {
  const size = useSize(() => document.documentElement)
  const [clientType, setClientType] = useState(CLIENT_TYPE.PC)
  useEffect(() => {
    const newClientType = document.body.clientWidth <= 960 ? CLIENT_TYPE.H5 : CLIENT_TYPE.PC
    setClientType(newClientType)
  }, [size])

  return {
    state: {
      clientType
    }
  }
}

export default useStoreContext

/** 客户端类型 */
export const CLIENT_TYPE = {
  PC: 1, // PC
  H5: 2 // H5
}

