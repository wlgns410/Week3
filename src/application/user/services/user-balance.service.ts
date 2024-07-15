// import { Inject, Injectable } from '@nestjs/common';
// import { UserBalanceChargeDto } from '../../../domain/user/entites/user-charge-balance.entity';
// import { UserBalanceRepository } from '../../../domain/user/interfaces/user-charge-repository.interface';
// import { UserBalanceSearchDto } from '../../../domain/user/entites/user-search-balance.entity';

// @Injectable()
// export class UserBalanceService {
//   constructor(
//     @Inject('UserBalanceRepository')
//     private readonly balanceRepository: UserBalanceRepository,
//   ) {}

//   async chargeBalance(userBalanceDto: UserBalanceChargeDto): Promise<void> {
//     await this.balanceRepository.chargeBalance(userBalanceDto);
//   }

//   async getBalance(
//     userBalanceSearchDto: UserBalanceSearchDto,
//   ): Promise<number> {
//     return await this.balanceRepository.getBalance(userBalanceSearchDto);
//   }
// }
