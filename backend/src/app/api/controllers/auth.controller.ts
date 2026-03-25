import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.register({ name, email, password });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.login({ email, password });
      return res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const result = await authService.refreshToken(refreshToken);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }
}
