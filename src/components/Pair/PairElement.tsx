import { useCallback, useEffect, useState, type FC, type SyntheticEvent } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { getPairRate } from '../../api/httpClient';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
import { type Pair } from '../../types/types';

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
  const [rateIndex, setRateIndex] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    options,
    updateRatesList,
    findRateIndex,
    allRates,
    deleteUserPair,
    updateUserPair,
  } = currenciesStore;

  const firstInputHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') {
      setFirstCurrency((prev) => ({ ...prev, amount: 0 }));
    }

    if (rateIndex !== undefined && Number(target.value)) {
      setFirstCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
      setSecondCurrency((prev) => ({
        ...prev,
        amount: Number(
          (Number(target.value) * allRates[rateIndex].conversion_rate).toFixed(2),
        ),
      }));
    }
  };

  const secondInputHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') {
      setSecondCurrency((prev) => ({ ...prev, amount: 0 }));
    }
    if (rateIndex !== undefined && Number(target.value)) {
      setSecondCurrency((prev) => ({ ...prev, amount: Number(target.value) }));
      setFirstCurrency((prev) => ({
        ...prev,
        amount: Number(
          (Number(target.value) / allRates[rateIndex].conversion_rate).toFixed(2),
        ),
      }));
    }
  };

  const updateExchange = useCallback(async () => {
    if (firstCurrency.code && secondCurrency.code) {
      setIsLoading(true);
      const rate = await getPairRate(firstCurrency.code, secondCurrency.code);
      updateRatesList(rate);
      const index = findRateIndex(firstCurrency.code, secondCurrency.code);
      console.log(`index of rate in ${pair.id} component: ${index}`);
      setRateIndex(index);
      updateUserPair(pair.id, firstCurrency.code, secondCurrency.code);
      if (firstCurrency.amount) {
        setSecondCurrency((prev) => ({
          ...prev,
          amount: Number((firstCurrency.amount * rate.conversion_rate).toFixed(2)),
        }));
      }
      setIsLoading(false);
      console.log(`effect in ${pair.id} pair`);
    }
  }, [firstCurrency.code, secondCurrency.code]);

  useEffect(() => {
    updateExchange();
  }, [updateExchange]);

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
        onChange={firstInputHandler}
        sx={{ width: 200 }}
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
        onChange={secondInputHandler}
        slotProps={{
          input: {
            endAdornment: (
              <>{isLoading ? <CircularProgress color="inherit" size={20} /> : null}</>
            ),
          },
        }}
        sx={{ width: 200 }}
      />
      <Button onClick={() => deleteUserPair(pair.id)}>X</Button>
    </div>
  );
});

export default PairElement;
