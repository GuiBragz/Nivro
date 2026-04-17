import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import * as bcrypt from "bcrypt";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "multer"; //

@Injectable()
export class UsersService {
  private supabase: SupabaseClient;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || "",
    );
  }

  async create(data: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
    });

    if (userExists) {
      throw new BadRequestException("E-mail ou CPF já cadastrados no sistema.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

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
        ...(phone && { phone }),
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

  async deleteUser(userId: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({ where: { user_id: userId } });
        await tx.account.deleteMany({ where: { user_id: userId } });
        await tx.tag.deleteMany({ where: { user_id: userId } });
        await tx.userProfile.deleteMany({ where: { user_id: userId } });
        await tx.user.delete({ where: { id: userId } });
      });

      return { message: "Conta excluída permanentemente." };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw new InternalServerErrorException(
        "Não foi possível excluir a conta. Tente novamente.",
      );
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Nenhum arquivo enviado.");
    }

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;

    // 1. Envia o arquivo para o bucket "avatars" no Supabase
    const { error: uploadError } = await this.supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Se já existir, sobrescreve
      });

    if (uploadError) {
      console.error("Erro no Supabase Storage:", uploadError);
      throw new InternalServerErrorException(
        "Falha ao salvar a imagem no servidor.",
      );
    }

    // 2. Pega a URL pública dessa imagem
    const { data: publicUrlData } = this.supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const avatarUrl = publicUrlData.publicUrl;

    // 3. Atualiza o banco de dados do usuário com a nova URL
    await this.updateProfile(userId, { avatar_url: avatarUrl });

    return { avatar_url: avatarUrl };
  }
}
