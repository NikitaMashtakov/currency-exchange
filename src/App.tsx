import type { FC } from 'react';
import styles from './App.module.css';
import PairElement from './components/Pair/PairElement';
import { currenciesStore } from './store';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {
  const { allUserPairs, newUserPair } = currenciesStore;
  console.log('all', allUserPairs);
  return (
    <>
      {allUserPairs.map((pair) => {
        console.log('pair id', pair);
        return <PairElement key={pair.id} pair={pair} />;
      })}
      <Button onClick={newUserPair}>добавить</Button>
    </>
  );
});

export default App;
