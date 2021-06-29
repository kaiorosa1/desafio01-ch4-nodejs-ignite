import { Statement } from "../entities/Statement";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      user_id,
      description,
      type,
      created_at,
      updated_at
    }) => {
      if(type !== OperationType.TRANSFER){
        return {
          id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        }
      }
      else {
        return {
          id,
          sender_id: user_id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        }
      }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
