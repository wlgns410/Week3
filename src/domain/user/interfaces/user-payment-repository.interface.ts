import { UserPaymentDto } from '../../../presentation/user/dtos/user-payment-request.entity';
import { UserPaymentResponseDto } from '../../../presentation/user/dtos/user-payment-response.entity';

export interface UserPaymentRepository {
  paymentUser(userPaymentDto: UserPaymentDto): Promise<UserPaymentResponseDto>;
}
