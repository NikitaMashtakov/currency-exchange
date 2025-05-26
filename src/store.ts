import { action, autorun, computed, makeObservable, observable } from 'mobx';

type Currency = {
  label: string;
  name: string;
};

type Pair = {
  base_code: string;
  target_code: string;
  conversion_rate: number;
};

class CurrenciesStore {
  allCurrencies: Currency[] = [];
  pairs: Pair[] = [];
  constructor() {
    makeObservable(this, {
      allCurrencies: observable,
      pairs: observable,
      addPair: action,
    });
    autorun(() =>
      fetch(`https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/codes`)
        .then((response) => response.json())
        .then((result) => {
          const gotCurrencies = result.supported_codes.map((code: string[]) => ({
            label: code[0],
            name: code[1],
          }));
          // console.log(gotCurrencies);
          this.allCurrencies = [...gotCurrencies];
          // console.log(allCurrencies);
          // const op = allCurrencies.map((currency) => currency.label);
          // setOptions(op);
        }),
    );
  }

  // get completedTodosCount() {
  //   return this.todos.filter((todo) => todo.completed === true).length;
  // }

  // get g() {
  //   if (this.todos.length === 0) return '<none>';
  //   const nextTodo = this.todos.find((todo) => todo.completed === false);
  //   return (
  //     `Next todo: "${nextTodo ? nextTodo.task : '<none>'}". ` +
  //     `Progress: ${this.completedTodosCount}/${this.todos.length}`
  //   );
  // }
  addPair(base: string, target: string) {
    console.log(this.pairs);
    const existedPair = this.pairs.find(
      (pair) => pair?.base_code === base && pair?.target_code === target,
    );
    let newPair: Pair;
    if (!existedPair) {
      fetch(
        `https://v6.exchangerate-api.com/v6/${
          import.meta.env.VITE_API_KEY
        }/pair/${base}/${target}`,
      )
        .then((response) => response.json())
        .then((result) => {
          newPair = {
            base_code: result.base_code,
            target_code: result.target_code,
            conversion_rate: result.conversion_rate,
          };
          this.pairs = [...this.pairs, newPair];
        });
    } else {
      fetch(
        `https://v6.exchangerate-api.com/v6/${
          import.meta.env.VITE_API_KEY
        }/pair/${base}/${target}`,
      )
        .then((response) => response.json())
        .then((result) => {
          newPair = {
            ...existedPair,
            conversion_rate: result.conversion_rate,
          };
          this.pairs = [...this.pairs, newPair];
        });
    }
  }
  // addTodo(task) {
  //   this.todos.push({
  //     task: task,
  //     completed: false,
  //     assignee: null,
  //   });
  // }
}

export const currenciesStore = new CurrenciesStore();
