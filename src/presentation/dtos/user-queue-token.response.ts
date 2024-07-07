export class UserQueueTokenResponse {
  constructor(
    public userId: number,
    public currentOrder: number,
    public token: string,
    public expiresAt: Date,
    public queueStatus: string,
    public estimatedWaitTime: number,
    public createdAt: Date,
  ) {}
}
