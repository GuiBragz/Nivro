import { Injectable, UnauthorizedException } from "@nestjs/common";
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
    // 1. Busca o usuário
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // 2. Compara a senha digitada com a hash do banco
    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // 3. Gera o payload e assina o token
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
