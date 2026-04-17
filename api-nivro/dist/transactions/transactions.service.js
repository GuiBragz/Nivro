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
        const { account_id, amount, type, category_id, description, executed_at } = data;
        return this.prisma.$transaction(async (tx) => {
            const account = await tx.account.findFirst({
                where: { id: account_id, user_id: userId },
            });
            if (!account)
                throw new common_1.BadRequestException("Conta não encontrada.");
            const transaction = await tx.transaction.create({
                data: {
                    description,
                    amount,
                    type,
                    user_id: userId,
                    account_id,
                    executed_at: new Date(executed_at),
                    tags: category_id ? { connect: [{ id: category_id }] } : undefined,
                },
                include: { tags: true },
            });
            const multiplier = type === "INCOME" ? 1 : -1;
            await tx.account.update({
                where: { id: account_id },
                data: { balance: { increment: amount * multiplier } },
            });
            return transaction;
        });
    }
    async getDashboard(userId) {
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
    async remove(id, userId) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { id, account: { user_id: userId } },
        });
        if (!transaction)
            throw new common_1.NotFoundException("Transação não encontrada.");
        const account = await this.prisma.account.findUnique({
            where: { id: transaction.account_id },
        });
        if (account) {
            const newBalance = transaction.type === "INCOME"
                ? Number(account.balance) - Number(transaction.amount)
                : Number(account.balance) + Number(transaction.amount);
            await this.prisma.account.update({
                where: { id: account.id },
                data: { balance: newBalance },
            });
        }
        await this.prisma.transaction.delete({ where: { id } });
        return { message: "Transação excluída e saldo revertido." };
    }
    // 👇 NOVA FUNÇÃO ADICIONADA AQUI: Apaga as transações e zera os saldos
    async clearHistory(userId) {
        try {
            // 1. Apaga todas as transações (o Prisma cuida das relações de N:N com as Tags)
            const deletedTx = await this.prisma.transaction.deleteMany({
                where: { user_id: userId },
            });
            // 2. Zera o saldo de todas as contas do usuário
            await this.prisma.account.updateMany({
                where: { user_id: userId },
                data: { balance: 0 },
            });
            return {
                message: "Histórico apagado com sucesso",
                transactionsDeleted: deletedTx.count,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Erro ao limpar histórico.");
        }
    }
    // --- GERENCIAMENTO DE TAGS (CORES!) ---
    async getTags(userId) {
        return this.prisma.tag.findMany({
            where: { user_id: userId },
            orderBy: { name: "asc" },
        });
    }
    async createTag(userId, name, color_hex) {
        return this.prisma.tag.create({
            data: {
                name,
                color_hex: color_hex || "#00B37E",
                user_id: userId,
            },
        });
    }
    // --- LÓGICA DE EDIÇÃO (ESTORNO E REAPLICAÇÃO) ---
    async update(id, userId, data) {
        const { account_id, amount, type, category_id, description, executed_at } = data;
        return this.prisma.$transaction(async (tx) => {
            const oldTx = await tx.transaction.findFirst({
                where: { id, account: { user_id: userId } },
            });
            if (!oldTx)
                throw new common_1.NotFoundException("Transação não encontrada.");
            const oldMultiplier = oldTx.type === "INCOME" ? -1 : 1;
            await tx.account.update({
                where: { id: oldTx.account_id },
                data: { balance: { increment: Number(oldTx.amount) * oldMultiplier } },
            });
            const updatedTx = await tx.transaction.update({
                where: { id },
                data: {
                    description,
                    amount,
                    type,
                    account_id,
                    executed_at: new Date(executed_at),
                    tags: category_id ? { set: [{ id: category_id }] } : { set: [] },
                },
            });
            const newMultiplier = type === "INCOME" ? 1 : -1;
            await tx.account.update({
                where: { id: account_id },
                data: { balance: { increment: amount * newMultiplier } },
            });
            return updatedTx;
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map