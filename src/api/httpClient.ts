import { countryCodes } from '../constants/codes';

export const getAllCurrencies = () => {
  return fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/codes`)
    .then((response) => response.json())
    .then((result) =>
      result.supported_codes.map((supportedCode: string[]) => {
        const country = countryCodes.find((code) => code.code === supportedCode[0]);
        return {
          code: supportedCode[0],
          name: supportedCode[1],
          label: country?.label || '', //так как не все флаги есть, может быть пустое значение
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
