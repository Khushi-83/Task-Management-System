import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class AuthService {
  async register(data: any) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await userRepository.create({ ...data, password: hashedPassword });
    return this.generateTokens(user);
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const { password: _, ...userWithoutPassword } = user;
    return this.generateTokens(userWithoutPassword);
  }

  async refreshToken(token: string) {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'supersecret_refresh';
      const decoded = jwt.verify(token, secret) as any;
      
      const user = await userRepository.findById(decoded.id);
      if (!user) throw new Error('User not found');

      const { password: _, ...userWithoutPassword } = user;
      return this.generateTokens(userWithoutPassword);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateTokens(user: any) {
    const accessSecret = process.env.JWT_ACCESS_SECRET || 'fallback-secret-123';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'supersecret_refresh';

    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      accessSecret,
      { expiresIn: '15m' } // Short-lived access token
    );

    const refreshToken = jwt.sign(
      { id: user.id }, 
      refreshSecret,
      { expiresIn: '7d' } // Long-lived refresh token
    );

    return { user, accessToken, refreshToken };
  }
}
