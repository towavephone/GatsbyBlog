export async function delayFunc(ms: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
