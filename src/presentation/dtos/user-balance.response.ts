export class UserBalanceResponse {
  constructor(
    public userId: number,
    public balance: number,
    public status: string,
  ) { }
}
