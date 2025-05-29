import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type SyntheticEvent,
} from 'react';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
import type { Pair } from '../../types/types';
import { Button } from '@mui/material';
type CurrencyState = {
  code: string | null;
  inputValue: string;
  amount: number;
};

type Props = {
  pair: Pair;
};

export const PairElement: FC<Props> = observer(({ pair }) => {
  const [firstCurrency, setFirstCurrency] = useState<CurrencyState>({
    code: pair.base_code,
    inputValue: '',
    amount: 0,
  });
  const [secondCurrency, setSecondCurrency] = useState<CurrencyState>({
    code: pair.target_code,
    inputValue: '',
    amount: 0,
  });

  const {
    options,
    getCurrentRate,
    findRateIndex,
    allRates,
    deleteUserPair,
    updateUserPair,
    allPairs,
  } = currenciesStore;

  // console.log('pairs', allPairs);
  // const updateExchange = async (first: string | null, second: string | null) => {
  //   if (first && second) {
  //     await newRate(first, second);
  //     await updateUserPair(pair.id, first, second);

  //   }
  // };
  //   const updateExchange = useCallback(async ()=>{
  // const newPair = await
  //   }, [firstCurrency.code, secondCurrency.code])
  useEffect(() => {
    // updateExchange(firstCurrency.value, secondCurrency.value);
    if (firstCurrency.code && secondCurrency.code) {
      getCurrentRate(firstCurrency.code, secondCurrency.code);
      updateUserPair(pair.id, firstCurrency.code, secondCurrency.code);
    }
  }, [firstCurrency.code, secondCurrency.code]);

  const pairRate = useMemo(() => {
    if (firstCurrency.code && secondCurrency.code) {
      const index = findRateIndex(firstCurrency.code, secondCurrency.code);
      console.log('memo', index);
      if (index !== -1) {
        setSecondCurrency((prev) => ({
          ...prev,
          amount: Number(
            (firstCurrency.amount * allRates[index].conversion_rate).toFixed(2),
          ),
        }));
        return index;
      }
    }
  }, [firstCurrency.code, secondCurrency.code]);

  const firstCurrencyHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') {
      setFirstCurrency((prev) => ({ ...prev, amount: 0 }));
    }

    if (pairRate !== undefined && Number(target.value)) {
      setFirstCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
      setSecondCurrency((prev) => ({
        ...prev,
        amount: Number(
          (Number(target.value) * allRates[pairRate].conversion_rate).toFixed(2),
        ),
      }));
    }
  };

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
        id={`first-amount-${pair.id}`}
        label="Сумма"
        value={firstCurrency.amount}
        onChange={firstCurrencyHandler}
      />
      <Autocomplete
        id={`first-currency-${pair.id}`}
        options={options}
        sx={{ width: 200 }}
        value={firstCurrency.code}
        inputValue={firstCurrency.inputValue}
        onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
          setFirstCurrency((prev) => ({ ...prev, code: newValue }));
        }}
        onInputChange={(event, newInputValue) => {
          setFirstCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
        }}
        renderInput={(params) => <TextField {...params} label="Выберите валюту" />}
      />

      <Autocomplete
        id={`second-currency-${pair.id}`}
        options={options}
        sx={{ width: 200 }}
        value={secondCurrency.code}
        inputValue={secondCurrency.inputValue}
        onChange={(event: SyntheticEvent<Element, Event>, newValue: string | null) => {
          setSecondCurrency((prev) => ({ ...prev, code: newValue }));
        }}
        onInputChange={(event, newInputValue) => {
          setSecondCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
        }}
        renderInput={(params) => <TextField {...params} label="Выберите валюту" />}
      />
      <TextField
        id={`second-amount-${pair.id}`}
        label="Сумма"
        value={secondCurrency.amount}
        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
          if (target.value === '') {
            setSecondCurrency((prev) => ({ ...prev, amount: 0 }));
          }
          if (pairRate !== undefined && Number(target.value)) {
            setSecondCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
            setFirstCurrency((prev) => ({
              ...prev,
              amount: Number(
                (Number(target.value) / allRates[pairRate].conversion_rate).toFixed(2),
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
