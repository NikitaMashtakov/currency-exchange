import { useEffect, useState } from 'react';
import styles from './App.module.css';
import PairElement from './components/Pair/PairElement';
import { currenciesStore } from './store';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import type { Pair } from './types/types';
import CircularProgress from '@mui/material/CircularProgress';

export const App = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>();

  const { userPairs, addUserPair } = currenciesStore;

  useEffect(() => {
    setIsLoading(true);
    currenciesStore.initStore().then(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Посчитай курс валют</h1>

      {isLoading ? (
        <CircularProgress color="inherit" size={50} />
      ) : (
        userPairs.map((pair: Pair) => <PairElement key={pair.id} pair={pair} />)
      )}

      <Button sx={{ margin: 'auto', border: '1px solid gray' }} onClick={addUserPair}>
        Добавить
      </Button>
    </div>
  );
});

export default App;
