import { autorun, makeAutoObservable, toJS } from 'mobx';
import { getAllCurrencies } from './api/httpClient';
import type { Currency, Rate, Pair, RateRequest } from './types/types';

const initialPairs: Pair[] = [
  { id: 0, base_code: 'RUB', target_code: 'USD' },
  { id: 1, base_code: 'RUB', target_code: 'EUR' },
];
class CurrenciesStore {
  currencies: Currency[] = [];
  rates: Rate[] = [];
  userPairs: Pair[] = [];
  pendingRequests: RateRequest[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initPairs();
    autorun(() => {
      sessionStorage.setItem('userPairs', JSON.stringify(this.userPairs));
    });
  }

  async initStore() {
    const receivedData = await getAllCurrencies();
    this.setCurrencies(receivedData);
  }

  //загрузка из session storage, чтобы при обновлении не слетали пары
  initPairs() {
    if (!sessionStorage.getItem('userPairs')) {
      sessionStorage.setItem('userPairs', JSON.stringify(initialPairs));
    }
    this.userPairs = JSON.parse(sessionStorage.getItem('userPairs') || '');
  }

  get options() {
    return this.currencies.slice().filter((currency) => currency.code !== 'SLE'); //фильтрация чтобы не было повторяющегося значения
  }

  get allRates() {
    return this.rates.slice().map((pair) => ({ ...pair }));
  }

  get allPairs() {
    return toJS(this.userPairs);
  }

  setCurrencies = (newState: Currency[]) => {
    this.currencies = [...newState];
  };

  addRate = (newRate: Rate) => {
    this.rates = [...this.rates, newRate];
  };

  updateRate = (index: number, rate: number) => {
    this.rates[index].conversion_rate = rate;
  };

  updateRatesList(rate: Rate) {
    const existedRateIndex = this.rates.findIndex(
      (el) => rate.base_code === el.base_code && rate.target_code === el.target_code,
    );
    //если курса для пары нет, добавляет, если уже есть все равно обновляем, но только сам курс
    if (existedRateIndex === -1) {
      this.addRate(rate);
    } else {
      this.updateRate(existedRateIndex, rate.conversion_rate);
    }
  }

  //индекс для доступа к актуальному курсу
  findRateIndex(base: string, target: string) {
    return this.rates.findIndex(
      (rate) => rate.base_code === base && rate.target_code === target,
    );
  }

  addUserPair() {
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
