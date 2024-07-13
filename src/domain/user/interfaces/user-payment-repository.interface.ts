import { UserPaymentDto } from '../entites/user-payment-request.entity';
import { UserPaymentResponseDto } from '../entites/user-payment-response.entity';

export interface UserPaymentRepository {
  paymentUser(userPaymentDto: UserPaymentDto): Promise<UserPaymentResponseDto>;
}
