import {
  Controller,
  UseGuards,
  Body,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auths/jwts/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { SetPasswordUserDto } from './dto/set-password-user.dto';

@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  preRegister(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/set-password')
  setPassword(
    @Param('id') id: number,
    @Body()
    SetPasswordUserDto: SetPasswordUserDto,
  ) {
    return this.usersService.setPassword(id, SetPasswordUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiBearerAuth()
  deleteOne(@Param('id') id: number) {
    return this.usersService.deleteOne(id);
  }
}
