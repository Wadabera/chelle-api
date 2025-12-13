import * as jwt from 'jsonwebtoken';

//this is the  referal  code generator***************************
export class CommonUtils {
  static generateReferralCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.toLocaleUpperCase();
  }

  static genarateJwtToken(jwtData) {
    const secret = process.env.JWT_SECRET || 'default_secret'; // <-- same fallback as JwtStrategy
    return jwt.sign(jwtData, secret, {
      expiresIn: '10m',
    });
  }
}
