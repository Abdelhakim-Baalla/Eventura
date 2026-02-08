import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    const { email, password, nom, prenom, telephone } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      role: Role.PARTICIPANT,
    });

    await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Inscription réussie',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User> }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }
}
