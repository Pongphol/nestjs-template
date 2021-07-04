import { IsNotEmpty, Length, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @Length(1, 255)
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @Length(1, 255)
  @MinLength(6, {
    message: 'Password must have at least 6 letters.',
  })
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  readonly userName: string;
}
