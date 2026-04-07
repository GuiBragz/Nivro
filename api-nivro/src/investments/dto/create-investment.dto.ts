import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  IsEnum,
} from "class-validator";

enum InvestmentOperation {
  BUY = "BUY", // Aporte (Aumenta saldo do investimento)
  SELL = "SELL", // Resgate (Diminui saldo do investimento)
  DIVIDEND = "DIVIDEND", // Rendimento (Aumenta saldo)
}

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string; // ID da corretora (Conta tipo INVESTMENT)

  @IsEnum(InvestmentOperation)
  @IsNotEmpty()
  operation: InvestmentOperation;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  asset_name: string; // Ex: "MXRF11", "Tesouro Direto", "CDB Itaú"

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]; // Ex: ["Renda Fixa", "FIIs", "Ações"]

  @IsNotEmpty()
  executed_at: string;
}
