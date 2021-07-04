import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { genSalt, hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { RegisterDto } from './dto/register.dto';
import { SetPasswordUserDto } from './dto/set-password-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (user) {
      throw new HttpException(
        'Email registered already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await genSalt(+this.configService.get('SALT_ROUND'));
    const password = await hash(registerDto.password, salt);

    return this.userRepository.save({ ...registerDto, password });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async setPassword(
    id: number,
    setPasswordUserDto: SetPasswordUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOneOrFail(id);

    if (await compare(setPasswordUserDto.password, user.password)) {
      throw new HttpException(
        'New password cannot be the same as your old password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await genSalt(+this.configService.get('SALT_ROUND'));
    const password = await hash(setPasswordUserDto.password, salt);

    return this.userRepository.save({
      ...user,
      password,
    });
  }

  async deleteOne(id: number) {
    return this.userRepository.softDelete(id);
  }

  async setRefreshToken(id: number, refreshToken: string) {
    return this.userRepository.update({ id }, { refreshToken });
  }

  async findByRefreshtoken(refreshToken: string) {
    return this.userRepository.findOne({ refreshToken });
  }
}
