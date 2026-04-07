import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
} from "class-validator";
import { TransactionType } from "@prisma/client";

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string; // De qual banco saiu o dinheiro?

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType; // INCOME, EXPENSE ou TRANSFER

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // Ex: ["Lazer", "PicPay", "Final de Semana"]

  @IsNotEmpty()
  executed_at: string; // Data da transação
}
