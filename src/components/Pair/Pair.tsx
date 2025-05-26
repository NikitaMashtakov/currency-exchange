import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { currencyList } from '../../constants/codes';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
type CurrencyState = {
  value: string | null;
  inputValue: string;
  amount: number;
};
type PairRate = {
  base_code: string;
  target_code: string;
  conversion_rate: number;
};
type Currency = {
  label: string;
  name: string;
};
// const pair: Pair = { base_code: 'RUB', target_code: 'USD', conversion_rate: 80 };

export const CurrencySelect = observer(() => {
  // const [pairs, setPairs] = useState<PairRate[]>([]);
  // const [options, setOptions] = useState<string[]>([]);
  // let allCurrencies: Currency[] = [];
  // let options: string[] = [];

  // const getAllCurrencies = () => {
  //   fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/codes`)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       const gotCurrencies = result.supported_codes.map((code: string[]) => ({
  //         label: code[0],
  //         name: code[1],
  //       }));
  //       console.log(gotCurrencies);
  //       allCurrencies = [...gotCurrencies];
  //       console.log(allCurrencies);
  //       const op = allCurrencies.map((currency) => currency.label);
  //       setOptions(op);
  //     });
  // };

  // const getPairRate = (first: string, second: string) => {
  //   fetch(
  //     `https://v6.exchangerate-api.com/v6/${
  //       import.meta.env.VITE_API_KEY
  //     }/pair/${first}/${second}`,
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       const newPair = {
  //         base_code: result.base_code,
  //         target_code: result.target_code,
  //         conversion_rate: result.conversion_rate,
  //       };
  //       setPairs((prev) => [...prev, newPair]);
  //     });
  // };
  const { allCurrencies, pairs, addPair } = currenciesStore;
  const options = allCurrencies.map((currency) => currency.label);
  const [firstCurrency, setFirstCurrency] = useState<CurrencyState>({
    value: 'USD',
    inputValue: '',
    amount: 0,
  });
  const [secondCurrency, setSecondCurrency] = useState<CurrencyState>({
    value: 'RUB',
    inputValue: '',
    amount: 0,
  });

  useEffect(() => {
    addPair('RUB', 'USD');
    addPair('RUB', 'EUR');
  }, []);

  // if (firstCurrency.value && secondCurrency.value) {
  //   getPairRate(firstCurrency.value, secondCurrency.value);
  // }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '20px' }}>
      <TextField
        id="outlined-controlled"
        label="Controlled"
        value={firstCurrency.amount}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          setFirstCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
          setSecondCurrency((prev) => ({
            ...prev,
            amount: Number(target.value) * pairs[0].conversion_rate,
          }));
        }}
      />
      <div>
        <div>{`value: ${
          firstCurrency.value !== null ? `'${firstCurrency.value}'` : 'null'
        }`}</div>
        <div>{`inputValue: '${firstCurrency.inputValue}'`}</div>
        <br />
        <Autocomplete
          value={firstCurrency.value}
          onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
            setFirstCurrency((prev) => ({ ...prev, value: newValue }));
          }}
          inputValue={firstCurrency.inputValue}
          onInputChange={(event, newInputValue) => {
            setFirstCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
          }}
          id="first-currency"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Controllable" />}
        />
      </div>
      <div>
        <div>{`value: ${
          secondCurrency.value !== null ? `'${secondCurrency.value}'` : 'null'
        }`}</div>
        <div>{`inputValue: '${secondCurrency.inputValue}'`}</div>
        <br />
        <Autocomplete
          value={secondCurrency.value}
          onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
            setSecondCurrency((prev) => ({ ...prev, value: newValue }));
          }}
          inputValue={secondCurrency.inputValue}
          onInputChange={(event, newInputValue) => {
            setSecondCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
          }}
          id="first-currency"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Controllable" />}
        />
      </div>
      <TextField
        id="outlined-controlled"
        label="Controlled"
        value={secondCurrency.amount}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          setSecondCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
          setFirstCurrency((prev) => ({
            ...prev,
            amount: Number(target.value) / pairs[0].conversion_rate,
          }));
        }}
      />
    </div>
  );
});

export default CurrencySelect;
