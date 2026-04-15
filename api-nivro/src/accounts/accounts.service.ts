import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.account.create({
      data: {
        ...data,
        user_id: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { user_id: userId },
      orderBy: { institution_name: "asc" },
    });
  }

  async getBalance(userId: string) {
    const accounts = await this.findAll(userId);
    const totalBalance = accounts.reduce(
      (acc, curr) => acc + Number(curr.balance),
      0,
    );
    return { totalBalance, accounts };
  }
}
