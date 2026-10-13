import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'auralis-enterprise-secret-key-voice-infra-2026';

export const auth = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  comparePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  },

  signToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },

  getUserFromRequest: (request) => {
    // 1. Check Authorization Bearer header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = auth.verifyToken(token);
      if (decoded) return decoded;
    }

    // 2. Check cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/auralis_token=([^;]+)/);
    if (match) {
      const token = match[1];
      const decoded = auth.verifyToken(token);
      if (decoded) return decoded;
    }

    return null;
  }
};
