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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        // 1. Verificar se E-mail ou CPF já existem
        const userExists = await this.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
        });
        if (userExists) {
            throw new common_1.BadRequestException("E-mail ou CPF já cadastrados no sistema.");
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
    // É ele que garante que ao logar, o seu nome e foto venham junto no pacote!
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) {
            throw new common_1.NotFoundException("Usuário não encontrado.");
        }
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async updateProfile(userId, data) {
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
    // 👇 MÉTODO ADICIONADO PARA EXCLUIR A CONTA 👇
    async deleteUser(userId) {
        try {
            // Usamos uma transação para garantir que tudo seja apagado junto
            await this.prisma.$transaction(async (tx) => {
                // 1. Apaga todas as transações do usuário
                await tx.transaction.deleteMany({
                    where: { user_id: userId },
                });
                // 2. Apaga todas as contas (bancos) do usuário
                await tx.account.deleteMany({
                    where: { user_id: userId },
                });
                // 3. Apaga as tags customizadas
                await tx.tag.deleteMany({
                    where: { user_id: userId },
                });
                // 4. Apaga o perfil (se não tiver cascade)
                await tx.userProfile.deleteMany({
                    where: { user_id: userId },
                });
                // 5. Por fim, apaga o próprio usuário
                await tx.user.delete({
                    where: { id: userId },
                });
            });
            return { message: "Conta excluída permanentemente." };
        }
        catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw new common_1.InternalServerErrorException("Não foi possível excluir a conta. Tente novamente.");
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map