import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // 1. Verificar se E-mail ou CPF já existem
    const userExists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
    });

    if (userExists) {
      throw new BadRequestException("E-mail ou CPF já cadastrados no sistema.");
    }

    // 2. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 3. Salvar no Supabase via Transaction
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

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // 👇 MÉTODO NOVO ADICIONADO PARA O LOGIN 👇
  // É ele que garante que ao logar, o seu nome e foto venham junto no pacote!
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  // --- MÉTODOS EXISTENTES ---

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const { full_name, birth_date, avatar_url, phone } = data;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Atualiza campos de User (se fornecidos)
        ...(phone && { phone }),
        // Atualiza campos de UserProfile (se fornecidos)
        profile: {
          update: {
            ...(full_name && { full_name }),
            ...(birth_date && { birth_date: new Date(birth_date) }),
            ...(avatar_url && { avatar_url }),
          },
        },
      },
      include: { profile: true },
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
