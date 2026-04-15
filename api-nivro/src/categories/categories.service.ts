import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: {
        OR: [
          { user_id: userId }, // Categorias do usuário
          { user_id: null }, // Categorias globais/padrão
        ],
      },
      orderBy: { name: "asc" },
    });
  }
}
