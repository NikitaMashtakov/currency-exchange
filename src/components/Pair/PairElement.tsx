import { useCallback, useEffect, useState, type FC } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { getPairRate } from '../../api/httpClient';
import { observer } from 'mobx-react-lite';
import { currenciesStore } from '../../store';
import { type Currency, type Pair } from '../../types/types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

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
  //хэндлеры для разгрузки кода ниже
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
      const rate = await getPairRate(firstCurrency.code, secondCurrency.code); //ожидание загрузки курса
      if (rate) {
        updateRatesList(rate);
        const index = findRateIndex(firstCurrency.code, secondCurrency.code); //индекс для дальнейшего доступа к курсу
        setRateIndex(index);
        updateUserPair(pair.id, firstCurrency.code, secondCurrency.code);
        if (firstCurrency.amount) {
          setSecondCurrency((prev) => ({
            ...prev,
            amount: Number((firstCurrency.amount * rate.conversion_rate).toFixed(2)), //здесь курс не через индекс, потому что сеттер еще не отработал
          }));
        }
      }
      setIsLoading(false);
    }
  }, [firstCurrency.code, secondCurrency.code]);

  useEffect(() => {
    updateExchange();
  }, [updateExchange]);

  return (
    <Paper
      style={{
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        justifyContent: 'center',
        width: 'max-content',
      }}
    >
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
          getOptionLabel={(option: Currency) => option.name}
          filterOptions={(filteredOptions, { inputValue }) => {
            const lowerCasedInput = inputValue.toLowerCase();
            return filteredOptions.filter(
              (option) =>
                option.name.toLowerCase().includes(lowerCasedInput) || // Поиск по названию
                option.code.toLowerCase().includes(lowerCasedInput), // Поиск по коду
            );
          }}
          sx={{ width: 200 }}
          value={options.find((option) => option.code === firstCurrency.code) || null}
          inputValue={firstCurrency.inputValue}
          onChange={(event, newValue: Currency | null) => {
            if (newValue) {
              setFirstCurrency((prev: CurrencyState) => ({
                ...prev,
                code: newValue.code,
              }));
            } else {
              setFirstCurrency((prev: CurrencyState) => ({ ...prev, code: '' }));
            }
          }}
          onInputChange={(event, newInputValue) => {
            setFirstCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...optionProps}
              >
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.label.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.label.toLowerCase()}.png`}
                  alt=""
                />
                {option.name} ({option.code})
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Выберите валюту"
              slotProps={{
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                },
              }}
            />
          )}
        />
      </div>
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

        <Autocomplete
          id={`second-currency-${pair.id}`}
          options={options}
          getOptionLabel={(option: Currency) => option.name}
          filterOptions={(filteredOptions, { inputValue }) => {
            const lowerCasedInput = inputValue.toLowerCase();
            return filteredOptions.filter(
              (option) =>
                option.name.toLowerCase().includes(lowerCasedInput) || // Поиск по названию
                option.code.toLowerCase().includes(lowerCasedInput), // Поиск по коду
            );
          }}
          sx={{ width: 200 }}
          value={options.find((option) => option.code === secondCurrency.code) || null}
          inputValue={secondCurrency.inputValue}
          onChange={(event, newValue: Currency | null) => {
            if (newValue) {
              setSecondCurrency((prev: CurrencyState) => ({
                ...prev,
                code: newValue.code,
              }));
            } else {
              setSecondCurrency((prev: CurrencyState) => ({ ...prev, code: '' }));
            }
          }}
          onInputChange={(event, newInputValue) => {
            setSecondCurrency((prev) => ({ ...prev, inputValue: newInputValue }));
          }}
          renderOption={(props, option) => {
            // const uniqueKey = option.code;
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...optionProps}
              >
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.label.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.label.toLowerCase()}.png`}
                  alt=""
                />
                {option.name} ({option.code})
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Выберите валюту"
              slotProps={{
                htmlInput: {
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                },
              }}
            />
          )}
        />
      </div>

      <Button
        onClick={() => deleteUserPair(pair.id)}
        sx={{
          margin: 'auto',
          width: '50px',
          '&:hover': {
            color: 'red',
          },
        }}
      >
        <ClearOutlinedIcon />
      </Button>
    </Paper>
  );
});

export default PairElement;
