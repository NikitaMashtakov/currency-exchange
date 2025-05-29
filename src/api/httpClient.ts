import { countryCodes } from '../constants/codes';

export const getAllCurrencies = () => {
  return fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/codes`)
    .then((response) => response.json())
    .then((result) =>
      result.supported_codes.map((element: string[]) => {
        const country = countryCodes.find((code) => code.label === element[0]);
        return {
          label: element[0],
          name: element[1],
          code: country,
        };
      }),
    )
    .catch((e) => {
      if (typeof e === 'string') {
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    });
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
    }))
    .catch((e) => {
      if (typeof e === 'string') {
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    });
};
