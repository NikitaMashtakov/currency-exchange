export const getAllCurrencies = () => {
  return fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/codes`)
    .then((response) => response.json())
    .then((result) =>
      result.supported_codes.map((code: string[]) => ({
        label: code[0],
        name: code[1],
      })),
    );
};

export const getPairRate = (base: string, target: string) => {
  return fetch(
    `https://v6.exchangerate-api.com/v6/${
      import.meta.env.VITE_API_KEY
    }/pair/${base}/${target}`,
  )
    .then((response) => response.json())
    .then((result) => ({
      base_code: result.base_code,
      target_code: result.target_code,
      conversion_rate: result.conversion_rate,
    }));
};
// try {
//     const response = await fetch(
//       'https://api.thecatapi.com/v1/images/search?size=small',
//       requestOptions,
//     );
//     const result = await response.json();
//     return result[0].url;
//   } catch (e) {
//     if (typeof e === 'string') {
//       console.log(e);
//     } else if (e instanceof Error) {
//       console.log(e.message); // works, `e` narrowed to Error
//     }
//   }
