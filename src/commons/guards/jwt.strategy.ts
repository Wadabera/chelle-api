import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret', //*********************unsolved */
    });
  }

  async validate(payload: any) {
    const { exp, iat, nbf, sub, ...rest } = payload;
    console.log('expire time', exp);
    console.log('user info', rest);
    return rest; //   attaches to req.user
  }
}

// /*FULL FLOW SUMMARY ABOUT JWT

// 1.User opens app → registers → no token needed
// 2.User logs in → sends username/password
// 3.Backend checks password → correct → creates JWT token (signed with secret)
// 4.Sends token back to frontend
// 5.Frontend saves token
// 6.User wants to see all users → calls GET /users/get-all
// 7.Frontend automatically adds header: Authorization: Bearer <token>
// 8.NestJS sees the @jwtAuthGuard() → asks JwtStrategy: "Is this token okay?"
// 9.JwtStrategy:
// 10.Takes token from header
// 11.Verifies signature using same JWT_SECRET
// 12.Checks if not expired
// 13.Returns user info → becomes req.user

// 14.Controller runs → req.user has user info → success!*/
