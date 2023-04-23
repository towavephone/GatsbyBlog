declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface Window {
  [propName: string]: any
}


