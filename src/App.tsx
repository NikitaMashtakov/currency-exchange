import type { FC } from 'react';
import styles from './App.module.css';
import Pair from './components/Pair/Pair';
import { currenciesStore } from './store';

function App() {
  const {
    allCurrencies,
    rates: pairs,
    newRate: newPair,
    allRates: allPairs,
  } = currenciesStore;

  // const options = useMemo(
  //   () => allCurrencies.map((currency) => currency.label),
  //   [allCurrencies],
  // );
  return <Pair />;
}

export default App;
