import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useMemo, useState, type FC, type SyntheticEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
import type { Pair } from '../../types/types';
import { Button } from '@mui/material';
type CurrencyState = {
  value: string | null;
  inputValue: string;
  amount: number;
};

type Props = {
  pair: Pair;
};

export const PairElement: FC<Props> = observer(({ pair }) => {
  const [firstCurrency, setFirstCurrency] = useState<CurrencyState>({
    value: pair.base_code,
    inputValue: '',
    amount: 0,
  });
  const [secondCurrency, setSecondCurrency] = useState<CurrencyState>({
    value: pair.target_code,
    inputValue: '',
    amount: 0,
  });

  const { options, newRate, findRateIndex, allRates, updateUserPair, deleteUserPair } =
    currenciesStore;

  // console.log('pairs', allPairs);

  useEffect(() => {
    if (firstCurrency.value && secondCurrency.value) {
      newRate(firstCurrency.value, secondCurrency.value);
      updateUserPair(pair.id, firstCurrency.value, secondCurrency.value);
      //
      console.log('effect', pair.id);
    }
  }, [firstCurrency.value, secondCurrency.value]);

  const pairRate = useMemo(() => {
    if (firstCurrency.value && secondCurrency.value) {
      const index = findRateIndex(firstCurrency.value, secondCurrency.value);
      // console.log('memo', index);
      return allRates[index];
    }
  }, [allRates]);
  // console.log(`render ${pair.id}`);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        padding: '20px',
        justifyContent: 'center',
      }}
    >
      <TextField
        id="first-amount"
        label="Сумма"
        value={firstCurrency.amount}
        type="number"
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          if (pairRate) {
            setFirstCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
            setSecondCurrency((prev) => ({
              ...prev,
              amount: Number(
                (Number(target.value) * pairRate.conversion_rate).toFixed(2),
              ),
            }));
          }
        }}
      />
      <Autocomplete
        id="first-currency"
        options={options}
        sx={{ width: 200 }}
        value={firstCurrency.value}
        inputValue={firstCurrency.inputValue}
        onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
          setFirstCurrency((prev) => ({ ...prev, value: newValue }));
        }}
        onInputChange={(event, newInputValue) => {
          setFirstCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
        }}
        renderInput={(params) => <TextField {...params} label="Выберите валюту" />}
      />

      <Autocomplete
        id="second-currency"
        options={options}
        sx={{ width: 200 }}
        value={secondCurrency.value}
        inputValue={secondCurrency.inputValue}
        onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
          setSecondCurrency((prev) => ({ ...prev, value: newValue }));
        }}
        onInputChange={(event, newInputValue) => {
          setSecondCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
        }}
        renderInput={(params) => <TextField {...params} label="Выберите валюту" />}
      />
      <TextField
        id="second-amount"
        label="Сумма"
        type="number"
        value={secondCurrency.amount}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          if (pairRate) {
            setSecondCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
            setFirstCurrency((prev) => ({
              ...prev,
              amount: Number(
                (Number(target.value) / pairRate.conversion_rate).toFixed(2),
              ),
            }));
          }
        }}
      />
      <Button onClick={() => deleteUserPair(pair.id)}>X</Button>
    </div>
  );
});

export default PairElement;
