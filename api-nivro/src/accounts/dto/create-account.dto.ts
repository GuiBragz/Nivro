import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { AccountType } from "@prisma/client"; // O Prisma já gerou esse Enum para você!

export class CreateAccountDto {
  @IsEnum(AccountType, {
    message: "O tipo deve ser CHECKING, CREDIT, INVESTMENT ou WALLET",
  })
  @IsNotEmpty()
  type: AccountType;

  @IsString()
  @IsNotEmpty()
  institution_name: string;

  @IsNumber()
  @IsOptional()
  balance?: number; // Saldo inicial (opcional, default é 0)

  // Específicos para cartão de crédito
  @IsNumber()
  @IsOptional()
  credit_limit?: number;

  @IsNumber()
  @IsOptional()
  closing_day?: number;

  @IsNumber()
  @IsOptional()
  due_day?: number;
}
