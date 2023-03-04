export function getAllCountryInfo() {
  return fetch('/assets/data.json')
    .then((response) => response.json())
    .then((result) => {
      const { name, path } = result;
      const repeatCount = 1000;
      const results = [];
      for (let i = 0; i < repeatCount; i++) {
        const offset = -0.001 * i;
        results.push({
          name: `${name} - ${i}`,
          path: path.map(([x, y]) => [x + offset, y + offset]),
          isSuccess: i % 2
        });
      }
      console.log('results', results);
      return results;
    })
    .catch(function(error) {
      console.log('parsing failed', error);
    });
}
