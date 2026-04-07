"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../prisma.service");
@(0, common_1.Injectable)()
class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || "fallback-secret-para-desenvolvimento",
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        // Verifica se o usuário do token ainda existe no banco
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user || user.status !== "ACTIVE") {
            throw new common_1.UnauthorizedException("Usuário inválido ou inativo.");
        }
        // O retorno daqui é injetado automaticamente no objeto Request (@Req())
        return { userId: payload.sub, email: payload.email };
    }
}
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map