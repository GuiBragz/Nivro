import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("E-mail ou senha incorretos.");
    }

    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException("E-mail ou senha incorretos.");
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }

  // --- LÓGICA DE RECUPERAÇÃO DE SENHA ---

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Por segurança, não estouramos erro se o e-mail não existir para evitar que hackers
    // descubram quem tem conta no app. Apenas fingimos que enviou.
    if (!user) {
      return {
        message:
          "Se o e-mail estiver cadastrado, as instruções foram enviadas.",
      };
    }

    // Gera um código de 6 dígitos aleatório (Ex: "582094")
    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Define a validade para 1 hora a partir de agora
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1);

    // Salva no banco de dados
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: recoveryCode,
        reset_password_expires: expiresIn,
      },
    });

    // Como não temos um serviço de disparo de e-mail (como AWS SES ou SendGrid),
    // vamos imprimir no terminal para podermos testar.
    console.log(`\n📧 [E-MAIL FAKE] -> Para: ${email}`);
    console.log(`🔑 Assunto: Recuperação de Senha`);
    console.log(`Seu código de verificação é: [ ${recoveryCode} ]\n`);

    return {
      message: "Se o e-mail estiver cadastrado, as instruções foram enviadas.",
    };
  }

  async resetPassword(email: string, token: string, new_password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new BadRequestException("Usuário ou código inválido.");

    // Verifica se o código bate e se ainda não expirou
    if (user.reset_password_token !== token) {
      throw new BadRequestException("Código de recuperação inválido.");
    }

    if (
      !user.reset_password_expires ||
      user.reset_password_expires < new Date()
    ) {
      throw new BadRequestException(
        "O código de recuperação expirou. Solicite um novo.",
      );
    }

    // Criptografa a nova senha
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(new_password, salt);

    // Atualiza a senha e limpa os campos de recuperação para invalidar o código usado
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: newHashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      },
    });

    return { message: "Senha alterada com sucesso! Você já pode fazer login." };
  }
}
