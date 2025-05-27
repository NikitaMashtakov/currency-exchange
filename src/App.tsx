import type { FC } from 'react';
import styles from './App.module.css';
import PairElement from './components/Pair/PairElement';
import { currenciesStore } from './store';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
  const { userPairs, newUserPair } = currenciesStore;

  return (
    <>
      {userPairs.map((pair) => (
        <PairElement key={pair.id} pair={pair} />
      ))}
      <Button onClick={newUserPair}>добавить</Button>
    </>
  );
});

export default App;
