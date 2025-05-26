import {
  action,
  autorun,
  computed,
  flow,
  makeAutoObservable,
  makeObservable,
  observable,
} from 'mobx';
import { getAllCurrencies, getPairRate } from './api/httpClient';
import type { Currency, Pair as Rate } from './types/types';

class CurrenciesStore {
  allCurrencies: Currency[] = [];
  rates: Rate[] = [];
  pairsToShow: Rate[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    autorun(() =>
      getAllCurrencies().then((gotCurrencies) => this.setAllCurrencies(gotCurrencies)),
    );
  }

  get options() {
    return this.allCurrencies.map((currency) => currency.label);
  }

  get allRates() {
    return this.rates.slice().map((pair) => ({ ...pair }));
  }

  setAllCurrencies = (newState: Currency[]) => {
    this.allCurrencies = [...newState];
  };

  addRate = (newRate: Rate) => {
    this.rates = [...this.rates, newRate];
  };

  updateRate = (index: number, rate: number) => {
    this.rates[index].conversion_rate = rate;
  };

  newRate(base: string, target: string) {
    const existedRateIndex = this.rates.findIndex(
      (rate) => rate.base_code === base && rate.target_code === target,
    );
    console.log(existedRateIndex);
    if (existedRateIndex === -1) {
      getPairRate(base, target).then((gotPair) => {
        this.addRate(gotPair);
        console.log('нет пары', this.rates);
      });
    } else {
      getPairRate(base, target).then((gotPair) => {
        this.updateRate(existedRateIndex, gotPair.conversion_rate);
        console.log('есть пара', this.rates);
      });
    }
  }
}
export const currenciesStore = new CurrenciesStore();
