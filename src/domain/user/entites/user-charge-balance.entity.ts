export enum TransactionType {
  CHARGE = 'CHARGE',
  USE = 'USE',
  REFUND = 'REFUND',
}

export class UserBalanceChargeDto {
  userId: number;
  balance: number;
}
