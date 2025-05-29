import type { FC } from 'react';
import styles from './App.module.css';
import PairElement from './components/Pair/PairElement';
import { currenciesStore } from './store';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import type { Pair } from './types/types';

export const App = observer(() => {
  const { userPairs, newUserPair } = currenciesStore;
  const savedPairs = JSON.parse(sessionStorage.getItem('userPairs') || '');
  return (
    <>
      <h1>Посчитай курс валют</h1>
      {savedPairs.map((pair: Pair) => (
        <PairElement key={pair.id} pair={pair} />
      ))}
      <Button onClick={newUserPair}>добавить</Button>
    </>
  );
});

export default App;
