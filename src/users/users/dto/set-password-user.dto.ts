import { IsNotEmpty, Length, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetPasswordUserDto {
  @IsNotEmpty()
  @Length(1, 255)
  @MinLength(6, {
    message: 'Password must have at least 6 letters.',
  })
  @ApiProperty()
  readonly password: string;
}
