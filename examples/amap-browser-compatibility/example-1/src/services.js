export function getAllCountryInfo() {
  return fetch('/assets/data.json')
    .then((response) => response.json())
    .catch(function(error) {
      console.log('parsing failed', error);
    });
}
