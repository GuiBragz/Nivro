import { IsOptional, IsString, IsDateString } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "Data de nascimento deve estar no formato ISO (AAAA-MM-DD)" },
  )
  birth_date?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string; // Para quando conectarmos com o Storage do Supabase!
}
