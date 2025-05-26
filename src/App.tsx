import type { FC } from 'react';
import styles from './App.module.css';
import CurrencySelect from './components/Pair/Pair';
import { currenciesStore } from './store';

function App() {
  return <CurrencySelect />;
}

export default App;
