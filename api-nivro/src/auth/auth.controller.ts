import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/recovery.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() body: Record<string, string>) {
    return this.authService.login(body.email, body.password);
  }

  // 👇 Novas rotas abaixo 👇

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.email,
      dto.token,
      dto.new_password,
    );
  }
}
