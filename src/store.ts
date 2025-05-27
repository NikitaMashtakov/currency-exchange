import { autorun, makeAutoObservable } from 'mobx';
import { getAllCurrencies, getPairRate } from './api/httpClient';
import type { Currency, Rate, Pair } from './types/types';

class CurrenciesStore {
  allCurrencies: Currency[] = [];
  rates: Rate[] = [];
  userPairs: Pair[] = [
    { id: 0, base_code: 'RUB', target_code: 'USD' },
    { id: 1, base_code: 'RUB', target_code: 'EUR' },
  ];
  private nextId: number = 2;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    getAllCurrencies().then((gotCurrencies) => this.setAllCurrencies(gotCurrencies));
    autorun(() => sessionStorage.setItem('userPairs', this.userPairs.toString()));
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
  findRateIndex(base: string, target: string) {
    return this.rates.findIndex(
      (rate) => rate.base_code === base && rate.target_code === target,
    );
  }
  // set nextId() {
  //    this.nextId++
  // }
  newUserPair() {
    this.userPairs.push({ id: this.nextId, base_code: '', target_code: '' });
    this.nextId++;
  }
  deleteUserPair(id: number) {
    const index = this.userPairs.findIndex((pair) => (pair.id = id));
    this.userPairs.splice(index, 1);
  }
}
export const currenciesStore = new CurrenciesStore();
