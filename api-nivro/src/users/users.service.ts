import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // 1. Verificar se E-mail ou CPF já existem (Segurança de duplicidade)
    const userExists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
    });

    if (userExists) {
      throw new BadRequestException("E-mail ou CPF já cadastrados no sistema.");
    }

    // 2. Criptografar a senha (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Salvar no Supabase (Transaction para garantir que User e Profile sejam criados juntos)
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          cpf: data.cpf,
          phone: data.phone,
          profile: {
            create: {
              full_name: data.full_name,
              birth_date: new Date(data.birth_date),
            },
          },
        },
        include: { profile: true },
      });

      // Remove a senha do retorno por segurança
      delete user.password_hash;
      return user;
    });
  }
}
