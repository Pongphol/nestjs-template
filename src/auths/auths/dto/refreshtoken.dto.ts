import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @IsNotEmpty()
  @Length(1, 270)
  @ApiProperty()
  readonly refreshToken: string;
}
