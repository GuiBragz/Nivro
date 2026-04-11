import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ForgotPasswordDto {
  @IsEmail({}, { message: "E-mail inválido." })
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: "E-mail inválido." })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: "O código deve ter 6 dígitos." })
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: "A nova senha deve ter entre 8 e 20 caracteres." })
  new_password: string;
}
