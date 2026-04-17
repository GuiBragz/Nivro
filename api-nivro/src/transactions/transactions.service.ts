import "multer";
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AiService } from "../ai/ai.service";
import csv = require("csv-parser");
import { Readable } from "stream";

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, data: any) {
    const { account_id, amount, type, category_id, description, executed_at } =
      data;

    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { id: account_id, user_id: userId },
      });

      if (!account) throw new BadRequestException("Conta não encontrada.");

      const transaction = await tx.transaction.create({
        data: {
          description,
          amount,
          type,
          user_id: userId,
          account_id,
          executed_at: new Date(executed_at),
          tags: category_id ? { connect: [{ id: category_id }] } : undefined,
        },
        include: { tags: true },
      });

      const multiplier = type === "INCOME" ? 1 : -1;
      await tx.account.update({
        where: { id: account_id },
        data: { balance: { increment: amount * multiplier } },
      });

      return transaction;
    });
  }

  async getDashboard(userId: string) {
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

  async remove(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, account: { user_id: userId } },
    });

    if (!transaction) throw new NotFoundException("Transação não encontrada.");

    const account = await this.prisma.account.findUnique({
      where: { id: transaction.account_id },
    });

    if (account) {
      const newBalance =
        transaction.type === "INCOME"
          ? Number(account.balance) - Number(transaction.amount)
          : Number(account.balance) + Number(transaction.amount);

      await this.prisma.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });
    }

    await this.prisma.transaction.delete({ where: { id } });
    return { message: "Transação excluída e saldo revertido." };
  }

  async clearHistory(userId: string) {
    try {
      const deletedTx = await this.prisma.transaction.deleteMany({
        where: { user_id: userId },
      });

      await this.prisma.account.updateMany({
        where: { user_id: userId },
        data: { balance: 0 },
      });

      return {
        message: "Histórico apagado com sucesso",
        transactionsDeleted: deletedTx.count,
      };
    } catch (error) {
      throw new InternalServerErrorException("Erro ao limpar histórico.");
    }
  }

  async getTags(userId: string) {
    return this.prisma.tag.findMany({
      where: { user_id: userId },
      orderBy: { name: "asc" },
    });
  }

  async createTag(userId: string, name: string, color_hex: string) {
    return this.prisma.tag.create({
      data: {
        name,
        color_hex: color_hex || "#00B37E",
        user_id: userId,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    const { account_id, amount, type, category_id, description, executed_at } =
      data;

    return this.prisma.$transaction(async (tx) => {
      const oldTx = await tx.transaction.findFirst({
        where: { id, account: { user_id: userId } },
      });

      if (!oldTx) throw new NotFoundException("Transação não encontrada.");

      const oldMultiplier = oldTx.type === "INCOME" ? -1 : 1;
      await tx.account.update({
        where: { id: oldTx.account_id },
        data: { balance: { increment: Number(oldTx.amount) * oldMultiplier } },
      });

      const updatedTx = await tx.transaction.update({
        where: { id },
        data: {
          description,
          amount,
          type,
          account_id,
          executed_at: new Date(executed_at),
          tags: category_id ? { set: [{ id: category_id }] } : { set: [] },
        },
      });

      const newMultiplier = type === "INCOME" ? 1 : -1;
      await tx.account.update({
        where: { id: account_id },
        data: { balance: { increment: amount * newMultiplier } },
      });

      return updatedTx;
    });
  }

  async importCsv(
    userId: string,
    accountId: string,
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException("Nenhum arquivo enviado.");
    if (!accountId) throw new BadRequestException("ID da conta é obrigatório.");

    const account = await this.prisma.account.findFirst({
      where: { id: accountId, user_id: userId },
    });

    if (!account) throw new NotFoundException("Conta bancária não encontrada.");

    const results = [];
    const stream = Readable.from(file.buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv({ separator: "," }))
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });

    const transactionsToSave = [];
    let netBalanceChange = 0;

    for (const row of results) {
      const rawDate = row["Data"] || row["date"] || Object.values(row)[0];
      const rawDescription =
        row["Descrição"] || row["description"] || Object.values(row)[1];
      const rawValue = row["Valor"] || row["amount"] || Object.values(row)[2];

      if (!rawDescription || !rawValue) continue;

      const iaData = await this.aiService.categorizeTransaction(
        String(rawDescription),
      );
      const cleanValue = parseFloat(
        String(rawValue)
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
          .trim(),
      );
      const amount = Math.abs(cleanValue);
      const type = cleanValue < 0 ? "EXPENSE" : "INCOME";

      transactionsToSave.push({
        description: iaData.cleanDescription,
        amount,
        type,
        user_id: userId,
        account_id: accountId,
        executed_at: new Date(String(rawDate).split("/").reverse().join("-")),
      });

      netBalanceChange += cleanValue;
    }

    if (transactionsToSave.length > 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.transaction.createMany({
          data: transactionsToSave,
        });

        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: netBalanceChange } },
        });
      });
    }

    return {
      message: "Extrato processado e saldos atualizados",
      total_imported: transactionsToSave.length,
    };
  }
}
