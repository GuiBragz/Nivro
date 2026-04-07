import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateAccountDto } from "./dto/create-account.dto";

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...data,
        user_id: userId, // Garante que a conta pertence a quem está logado
      },
    });
  }

  async findAll(userId: string) {
    // Retorna todas as contas do usuário
    return this.prisma.account.findMany({
      where: { user_id: userId },
      orderBy: { institution_name: "asc" },
    });
  }
}
