"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
@(0, common_1.Injectable)()
class TransactionsService {
    prisma;
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
                    tags: {
                        connectOrCreate: tags?.map((tagName) => ({
                            where: { id: tagName }, // Aqui idealmente buscaríamos por nome, mas para simplificar:
                            create: { name: tagName, user_id: userId, color_hex: "#808080" },
                        })),
                    },
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
}
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map