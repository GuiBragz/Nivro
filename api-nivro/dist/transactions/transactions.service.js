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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const { tags, account_id, amount, type, ...rest } = data;
        // Usamos $transaction para garantir que se um passo falhar, nada seja salvo
        return this.prisma.$transaction(async (tx) => {
            // 1. Verificar se a conta pertence ao usuário
            const account = await tx.account.findFirst({
                where: { id: account_id, user_id: userId },
            });
            if (!account)
                throw new common_1.BadRequestException("Conta não encontrada.");
            // 2. Criar a transação e conectar as Tags
            const transaction = await tx.transaction.create({
                data: {
                    ...rest,
                    amount,
                    type,
                    user_id: userId,
                    account_id,
                    // Lógica de "Connect or Create" para as tags
                    // Só tenta conectar ou criar se a lista de tags existir e tiver itens
                    tags: tags && tags.length > 0
                        ? {
                            connectOrCreate: tags.map((tagName) => ({
                                where: { id: tagName },
                                create: {
                                    name: tagName,
                                    user_id: userId,
                                    color_hex: "#808080",
                                },
                            })),
                        }
                        : undefined,
                },
                include: { tags: true },
            });
            // 3. Atualizar o Saldo da Conta (Lógica Financeira)
            const multiplier = type === "INCOME" ? 1 : -1;
            await tx.account.update({
                where: { id: account_id },
                data: {
                    balance: { increment: amount * multiplier },
                },
            });
            return transaction;
        });
    }
    async getDashboard(userId) {
        // Busca as últimas 10 transações com as logos e tags para a Home
        return this.prisma.transaction.findMany({
            where: { user_id: userId },
            take: 10,
            orderBy: { executed_at: "desc" },
            include: {
                account: { select: { institution_name: true, type: true } },
                tags: true,
            },
        });
    }
    // --- LÓGICA DE EXCLUSÃO (REVERTENDO O SALDO) ---
    async remove(id, userId) {
        // 1. Busca a transação e garante que ela pertence a uma conta deste usuário
        const transaction = await this.prisma.transaction.findFirst({
            where: {
                id,
                account: { user_id: userId },
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException("Transação não encontrada ou não pertence a você.");
        }
        // 2. Busca a conta para reverter o saldo
        const account = await this.prisma.account.findUnique({
            where: { id: transaction.account_id },
        });
        if (account) {
            // Se era uma RECEITA (+), a gente subtrai do saldo. Se era DESPESA (-), a gente soma de volta.
            const newBalance = transaction.type === "INCOME"
                ? Number(account.balance) - Number(transaction.amount)
                : Number(account.balance) + Number(transaction.amount);
            await this.prisma.account.update({
                where: { id: account.id },
                data: { balance: newBalance },
            });
        }
        // 3. Apaga a transação de fato
        await this.prisma.transaction.delete({
            where: { id },
        });
        return { message: "Transação excluída e saldo revertido com sucesso." };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map