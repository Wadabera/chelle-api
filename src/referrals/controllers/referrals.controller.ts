import { ReferralService } from 'src/referrals/services/referrals.sevice';
import { Referral } from './../schemas/referrals.schema';
import { Controller, Get, Req } from '@nestjs/common';
import { jwtAuthGuard } from 'src/commons/guards/jwtauth.guard';
import { JwtStrategy } from 'src/commons/guards/jwt.strategy';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly ReferralService: ReferralService) {}
//purpose: return the user who referred the current user********************************
  @jwtAuthGuard()
  @Get('my-referrer')
  async getMyreferrer(@Req() req: any) {
    return await this.ReferralService.getMyreferrer(req.user);
    console.log(req.user);
  }
  @jwtAuthGuard()
@Get('my-referred-users')
async getMyreferredUsers(@Req() req: any) {
  return await this.ReferralService.getMyRefferedUsers(req.user);
}

}
