import { autorun, makeAutoObservable, toJS } from 'mobx';
import { getAllCurrencies, getPairRate } from './api/httpClient';
import type { Currency, Rate, Pair } from './types/types';

class CurrenciesStore {
  private currencies: Currency[] = [];
  private rates: Rate[] = [];
  private userPairs: Pair[] = [
    { id: 0, base_code: 'RUB', target_code: 'USD' },
    { id: 1, base_code: 'RUB', target_code: 'EUR' },
  ];
  private nextId: number = 2;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    getAllCurrencies().then((gotCurrencies) => this.setAllCurrencies(gotCurrencies));
    this.userPairs.forEach((pair) => this.newRate(pair.base_code, pair.target_code));
    sessionStorage.setItem('userPairs', JSON.stringify(this.userPairs));
  }

  get options() {
    return this.currencies.map((currency) => currency.label);
  }

  get allRates() {
    return this.rates.slice().map((pair) => ({ ...pair }));
  }

  get allUserPairs() {
    return toJS(this.userPairs);
    // .slice().map((pair) => ({ ...pair }));
  }

  setAllCurrencies = (newState: Currency[]) => {
    this.currencies = [...newState];
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
    // console.log(existedRateIndex);
    if (existedRateIndex === -1) {
      getPairRate(base, target).then((gotPair) => {
        this.addRate(gotPair);
        console.log('нет пары', this.rates);
        console.log(this.allRates);
      });
    } else {
      getPairRate(base, target).then((gotPair) => {
        this.updateRate(existedRateIndex, gotPair.conversion_rate);
        console.log('есть пара', this.rates);
        console.log(this.allRates);
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
  //
  updateUserPair(id: number, base: string, target: string) {
    console.log('update');
    const index = toJS(this.userPairs).findIndex((pair) => {
      console.log(toJS(pair), 'айди', id, base, target);
      return (pair.id = id);
    });
    console.log('update index', index, id, base, target);
    // console.log('update pair', this.userPairs[index]);
    if (index !== -1) {
      this.userPairs[index].base_code = base;
      this.userPairs[index].target_code = target;
    }
  }

  deleteUserPair(id: number) {
    const index = this.userPairs.findIndex((pair) => (pair.id = id));
    this.userPairs.splice(index, 1);
  }
}
export const currenciesStore = new CurrenciesStore();
