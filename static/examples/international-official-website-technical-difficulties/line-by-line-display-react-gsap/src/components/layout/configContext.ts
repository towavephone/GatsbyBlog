import { createContext } from 'react';

interface Config {
  isRunMultiTime?: boolean;
}

const config = {
  isRunMultiTime: false
};

export default createContext<Config>(config);
