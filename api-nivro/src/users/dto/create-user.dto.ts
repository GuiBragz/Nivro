import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsDateString,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "E-mail inválido" })
  email: string;

  @IsNotEmpty()
  @Length(8, 20, { message: "A senha deve ter entre 8 e 20 caracteres" })
  password: string;

  @IsString()
  @Matches(/^[0-9]{11}$/, {
    message: "O CPF deve conter exatamente 11 dígitos numéricos",
  })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsDateString(
    {},
    { message: "Data de nascimento deve estar no formato ISO (AAAA-MM-DD)" },
  )
  birth_date: string;

  @IsString()
  phone: string;
}
