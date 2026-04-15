"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(email, pass) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException("E-mail ou senha incorretos.");
        }
        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException("E-mail ou senha incorretos.");
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email },
        };
    }
    // --- LÓGICA DE RECUPERAÇÃO DE SENHA ---
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                message: "Se o e-mail estiver cadastrado, as instruções foram enviadas.",
            };
        }
        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                reset_password_token: recoveryCode,
                reset_password_expires: expiresIn,
            },
        });
        // --- DISPARO REAL DO E-MAIL VIA RESEND ---
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        try {
            await transporter.sendMail({
                // Se ainda não verificou um domínio no Resend, use onboarding@resend.dev
                from: '"Equipe Nivro" <onboarding@resend.dev>',
                to: email,
                subject: "Recuperação de Senha - Nivro 🔑",
                text: `Seu código de verificação é: ${recoveryCode}`,
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #121214; background-color: #f4f4f5; border-radius: 8px;">
            <h2 style="color: #00B37E;">Nivro</h2>
            <h3>Recuperação de Senha</h3>
            <p>Você solicitou a recuperação de senha no aplicativo.</p>
            <p>Seu código de verificação é:</p>
            <h1 style="color: #00B37E; letter-spacing: 5px; background: #fff; padding: 10px; border-radius: 8px; display: inline-block;">${recoveryCode}</h1>
            <p style="color: #8D8D99; font-size: 12px; margin-top: 20px;">Este código expira em 1 hora.</p>
          </div>
        `,
            });
            console.log(`✅ E-mail real enviado com sucesso para ${email}!`);
        }
        catch (error) {
            console.error("❌ Erro ao enviar o e-mail:", error);
        }
        return {
            message: "Se o e-mail estiver cadastrado, as instruções foram enviadas.",
        };
    }
    async resetPassword(email, token, new_password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException("Usuário ou código inválido.");
        if (user.reset_password_token !== token) {
            throw new common_1.BadRequestException("Código de recuperação inválido.");
        }
        if (!user.reset_password_expires ||
            user.reset_password_expires < new Date()) {
            throw new common_1.BadRequestException("O código de recuperação expirou. Solicite um novo.");
        }
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(new_password, salt);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map