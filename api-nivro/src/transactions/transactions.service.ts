import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateTransactionDto) {
    const { tags, account_id, amount, type, ...rest } = data;

    // Usamos $transaction para garantir que se um passo falhar, nada seja salvo
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar se a conta pertence ao usuário
      const account = await tx.account.findFirst({
        where: { id: account_id, user_id: userId },
      });

      if (!account) throw new BadRequestException("Conta não encontrada.");

      // 2. Criar a transação e conectar as Tags
      const transaction = await tx.transaction.create({
        data: {
          ...rest,
          amount,
          type,
          user_id: userId,
          account_id,
          // Lógica de "Connect or Create" para as tags
          // Só tenta conectar ou criar se a lista de tags existir e tiver itens
          tags:
            tags && tags.length > 0
              ? {
                  connectOrCreate: tags.map((tagName) => ({
                    where: { id: tagName },
                    create: {
                      name: tagName,
                      user_id: userId,
                      color_hex: "#808080",
                    },
                  })),
                }
              : undefined,
        },
        include: { tags: true },
      });

      // 3. Atualizar o Saldo da Conta (Lógica Financeira)
      const multiplier = type === "INCOME" ? 1 : -1;
      await tx.account.update({
        where: { id: account_id },
        data: {
          balance: { increment: amount * multiplier },
        },
      });

      return transaction;
    });
  }

  async getDashboard(userId: string) {
    // Busca as últimas 10 transações com as logos e tags para a Home
    return this.prisma.transaction.findMany({
      where: { user_id: userId },
      take: 10,
      orderBy: { executed_at: "desc" },
      include: {
        account: { select: { institution_name: true, type: true } },
        tags: true,
      },
    });
  }
}
