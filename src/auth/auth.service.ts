import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userRepository.findOne(email);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: RegisterUserDto) {
    // Register user with email and password
    if (user.password) {
      try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        await this.userRepository.save({
          email: user.email,
          password: hash,
          salt,
        });

        const newUser = await this.userRepository.findOne({
          where: { email: user.email },
        });
        return this.generateJwt({
          sub: newUser.id,
          email: newUser.email,
        });
      } catch (error) {
        if (error.code === '23505') {
          throw new BadRequestException('User already exists');
        }
      }
    }

    // Adding user from OAuth2 provider
    try {
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    delete user.password;
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
