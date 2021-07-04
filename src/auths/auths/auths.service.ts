import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/users/users.service";
import { RefreshTokenDto } from "./dto/refreshtoken.dto";

@Injectable()
export class AuthsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;


      return { ...result };
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFESH_TOKEN_SECRET,
      expiresIn: "1d",
    });

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: "1h" }),
      refreshToken: refreshToken,
    };
  }

  async refreshtoken(refreshTokenDto: RefreshTokenDto) {
    let tokenDecoded;
    try {
      tokenDecoded = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_REFESH_TOKEN_SECRET,
      });
    } catch (error) {
      return {
        accessToken: null,
        refreshToken: null,
      };
    }

    const user = await this.usersService.findOne(tokenDecoded?.sub);

    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: "1h" }),
      refreshToken: refreshTokenDto.refreshToken,
    };
  }
}
