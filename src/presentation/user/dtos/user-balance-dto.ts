export enum TransactionType {
  CHARGE = 'CHARGE',
  USE = 'USE',
  REFUND = 'REFUND',
}

export class UserBalanceChargeDto {
  userId: number;
  balance: number;
}

export class UserBalanceLogDto {
  userId: number;
  amount: number;
  transactionType: TransactionType;
}
