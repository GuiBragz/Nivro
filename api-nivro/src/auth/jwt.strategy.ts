import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || "fallback-secret-para-desenvolvimento",
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Verifica se o usuário do token ainda existe no banco
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Usuário inválido ou inativo.");
    }

    // O retorno daqui é injetado automaticamente no objeto Request (@Req())
    return { userId: payload.sub, email: payload.email };
  }
}
