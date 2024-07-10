import { UserBalanceChargeDto } from '../entites/user-charge-balance.entity';
import { UserBalanceSearchDto } from '../entites/user-search-balance.entity';

export interface UserBalanceRepository {
  chargeBalance(userBalanceChargeDto: UserBalanceChargeDto): Promise<void>;
  //   getBalance(userBalanceSearchDto: UserBalanceSearchDto): Promise<void>;
}
