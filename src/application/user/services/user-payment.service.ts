import { Inject, Injectable } from '@nestjs/common';
import { UserPaymentRepository } from '../../../domain/user/interfaces/user-payment-repository.interface';
import { UserPaymentDto } from '../../../domain/user/entites/user-payment-request.entity';
import { UserPaymentResponseDto } from '../../../domain/user/entites/user-payment-response.entity';

@Injectable()
export class UserPaymentService {
  constructor(
    @Inject('UserPaymentRepository')
    private readonly userPaymentRepository: UserPaymentRepository,
  ) {}

  async paymentUser(
    userPaymentDto: UserPaymentDto,
  ): Promise<UserPaymentResponseDto> {
    return this.userPaymentRepository.paymentUser(userPaymentDto);
  }
}
