import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const userData = {
      ...user,
      password: hashedPassword,
    };
    const newUser = await this.prisma.user.create({
      data: userData,
      select: {
        name: true,
        email: true,
        id: true,
        role: true,
        password: false,
        hashedRefreshToken: false,
      },
    });
    return newUser;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
