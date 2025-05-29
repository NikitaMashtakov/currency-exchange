import { autorun, makeAutoObservable, toJS } from 'mobx';
import { getAllCurrencies, getPairRate } from './api/httpClient';
import type { Currency, Rate, Pair, RateRequest } from './types/types';
const initialPairs: Pair[] = [
  { id: 0, base_code: 'RUB', target_code: 'USD' },
  { id: 1, base_code: 'RUB', target_code: 'EUR' },
];
class CurrenciesStore {
  allCurrencies: Currency[] = [];
  rates: Rate[] = [];
  userPairs: Pair[] = [];
  // private nextId: number = Date.now();
  pendingRequests: RateRequest[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    getAllCurrencies().then((gotCurrencies) => this.setAllCurrencies(gotCurrencies));
    this.initPairs();
    console.log('pairs in constructor', toJS(this.userPairs));
    autorun(() => {
      sessionStorage.setItem('userPairs', JSON.stringify(this.userPairs));
    });
  }
  initPairs() {
    if (!sessionStorage.getItem('userPairs')) {
      sessionStorage.setItem('userPairs', JSON.stringify(initialPairs));
    }
    this.userPairs = JSON.parse(sessionStorage.getItem('userPairs') || '');
  }
  get options() {
    return this.allCurrencies.map((currency) => currency.label);
  }

  get allRates() {
    return this.rates.slice().map((pair) => ({ ...pair }));
  }

  get allPairs() {
    return toJS(this.userPairs);
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

  getCurrentRate(base: string, target: string) {
    const existedRateIndex = this.rates.findIndex(
      (rate) => rate.base_code === base && rate.target_code === target,
    );
    const existedRequestIndex = this.pendingRequests.findIndex(
      (request) => request.base_code === base && request.target_code === target,
    );

    console.log(existedRateIndex);

    if (existedRateIndex === -1 && existedRequestIndex === -1) {
      const reqId = Date.now();
      this.pendingRequests.push({ id: reqId, base_code: base, target_code: target });
      getPairRate(base, target).then((gotPair) => {
        this.addRate(gotPair);

        const index = this.pendingRequests.findIndex((req) => req.id === reqId);
        if (index !== -1) {
          this.pendingRequests.splice(index, 1);
        }

        console.log('нет пары', this.allRates);
        return gotPair;
      });
    } else if (existedRateIndex === -1 && existedRequestIndex !== -1) {
      return;
    } else {
      getPairRate(base, target).then((gotPair) => {
        this.updateRate(existedRateIndex, gotPair.conversion_rate);
        console.log('есть пара', this.allRates);
        return gotPair;
      });
    }
  }

  findRateIndex(base: string, target: string) {
    // const index = this.pendingRequests.findIndex(
    //   (req) => req.base_code === base && req.target_code === target,
    // );
    // if (index !== -1) {
    return this.rates.findIndex(
      (rate) => rate.base_code === base && rate.target_code === target,
    );
    // }
  }

  newUserPair() {
    this.userPairs = [
      ...this.userPairs,
      { id: Date.now(), base_code: '', target_code: '' },
    ];
  }

  deleteUserPair(targetId: number) {
    const index = this.userPairs.findIndex((pair) => pair.id === targetId);
    this.userPairs.splice(index, 1);
  }

  updateUserPair(targetId: number, base: string, target: string) {
    const index = this.userPairs.findIndex((pair) => pair.id === targetId);
    if (index !== -1) {
      this.userPairs[index].base_code = base;
      this.userPairs[index].target_code = target;
    }
  }
}
export const currenciesStore = new CurrenciesStore();
