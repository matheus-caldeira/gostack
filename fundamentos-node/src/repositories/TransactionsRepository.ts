import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    if (!this.transactions.length) return { total: 0, income: 0, outcome: 0 };

    const income = this.transactions
      .map(transaction => {
        if (transaction.type === 'income') return transaction.value;
        return 0;
      })
      .reduce((acc, cur) => acc + cur);

    const outcome = this.transactions
      .map(transaction => {
        if (transaction.type === 'outcome') return transaction.value;
        return 0;
      })
      .reduce((acc, cur) => acc + cur);

    const total = income - outcome;

    return { total, income, outcome };
  }

  public create({ title, type, value }: CreateTransction): Transaction {
    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
