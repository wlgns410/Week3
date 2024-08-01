import { BearerGuard } from './bearer.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionError } from '../../common/exceptions';

@Injectable()
export class QueueGuard extends BearerGuard {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const token = request.bearer;

    try {
      const decoded = this.jwtService.verify(token);
      request.user = {
        userId: decoded.userId,
        token: decoded.token,
      };
      return true;
    } catch (err) {
      throw ExceptionError.unauthorized('Invalid token');
    }
  }
}
