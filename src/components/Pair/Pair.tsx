import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { currencyList } from '../../constants/codes';
import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
import { Button } from '@mui/material';
type CurrencyState = {
  value: string | null;
  inputValue: string;
  amount: number;
};

export const Pair = observer(() => {
  const [firstCurrency, setFirstCurrency] = useState<CurrencyState>({
    value: '',
    inputValue: '',
    amount: 0,
  });
  const [secondCurrency, setSecondCurrency] = useState<CurrencyState>({
    value: '',
    inputValue: '',
    amount: 0,
  });

  const { options, newRate: newPair, rates } = currenciesStore;

  // console.log('pairs', allPairs);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '20px' }}>
      <TextField
        id="outlined-controlled"
        label="Controlled"
        value={firstCurrency.amount}
        // type="number"
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          if (Number(target.value)) {
            setFirstCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
            setSecondCurrency((prev) => ({
              ...prev,
              amount: Number(target.value) * rates[0].conversion_rate,
            }));
          }
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
          if (Number(target.value)) {
            setSecondCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
            setFirstCurrency((prev) => ({
              ...prev,
              amount: Number(target.value) / rates[0].conversion_rate,
            }));
          }
        }}
      />
      <Button
        onClick={() => {
          if (firstCurrency.value && secondCurrency.value) {
            newPair(firstCurrency.value, secondCurrency.value);
          }
        }}
      >
        +
      </Button>
    </div>
  );
});

export default Pair;
