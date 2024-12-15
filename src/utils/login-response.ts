import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';
import { BadRequestException } from './service-exceptions';

export const loginResponse = async (userId: string) => {
  try {
    // Fetch user by ID
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate access token
    const accessToken = generateAccessToken({ userId });

    // Return user and token
    return {
      accessToken,
      user: { ...user, password: undefined }, // Exclude password from response
    };
  } catch (error) {
    console.error('Error in loginResponse:', error);
    throw new BadRequestException('Failed to generate login response');
  }
};

export const generateAccessToken = (payload: { userId: string }) => {
  const { userId } = payload;

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    throw new Error('Server configuration error: Missing JWT_SECRET');
  }

  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '24h',
      issuer: 'edsu_bas',
    }
  );

  console.log('JWT generated:', accessToken); // Debugging log
  return accessToken;
};
