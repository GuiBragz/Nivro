import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateInvestmentDto } from "./dto/create-investment.dto";

@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateInvestmentDto) {
    const { operation, amount, asset_name, tags, account_id, executed_at } =
      data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Validar se a conta existe e é de investimento
      const account = await tx.account.findFirst({
        where: { id: account_id, user_id: userId, type: "INVESTMENT" },
      });

      if (!account) {
        throw new BadRequestException("Conta de investimento não encontrada.");
      }

      // 2. Mapear a operação para Entrada/Saída
      const transactionType = operation === "SELL" ? "EXPENSE" : "INCOME";

      // 3. Registrar a transação como investimento
      const investmentTx = await tx.transaction.create({
        data: {
          user_id: userId,
          account_id,
          amount,
          type: transactionType,
          description: `${operation === "DIVIDEND" ? "Rendimento" : "Operação"} - ${asset_name}`,
          executed_at: new Date(executed_at),
          tags:
            tags && tags.length > 0
              ? {
                  connectOrCreate: tags.map((t) => ({
                    where: { id: t },
                    create: { name: t, user_id: userId, color_hex: "#10B981" },
                  })),
                }
              : undefined,
        },
      });

      // 4. Atualizar o saldo da corretora
      const multiplier = transactionType === "INCOME" ? 1 : -1;
      await tx.account.update({
        where: { id: account_id },
        data: { balance: { increment: amount * multiplier } },
      });

      return investmentTx;
    });
  }

  async getPortfolio(userId: string) {
    // Retorna todas as contas de investimento e o saldo total consolidado
    const accounts = await this.prisma.account.findMany({
      where: { user_id: userId, type: "INVESTMENT" },
      select: { institution_name: true, balance: true },
    });

    const totalInvested = accounts.reduce(
      (acc, curr) => acc + Number(curr.balance),
      0,
    );

    return {
      total_invested: totalInvested,
      portfolio: accounts,
    };
  }
}
