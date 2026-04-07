"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const create_investment_dto_1 = require("./dto/create-investment.dto");
@(0, common_1.Injectable)()
class InvestmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const { operation, amount, asset_name, tags, account_id, executed_at } = data;
        return this.prisma.$transaction(async (tx) => {
            // 1. Validar se a conta existe e é de investimento
            const account = await tx.account.findFirst({
                where: { id: account_id, user_id: userId, type: "INVESTMENT" },
            });
            if (!account) {
                throw new common_1.BadRequestException("Conta de investimento não encontrada.");
            }
            // 2. Mapear a operação para Entrada/Saída
            const transactionType = operation === "SELL" ? "EXPENSE" : "INCOME";
            // 3. Registrar a transação como investimento
            const investmentTx = await tx.transaction.create({
                data: {
                    user_id: userId,
                    account_id,
                    amount,
                    type: transactionType,
                    description: `${operation === "DIVIDEND" ? "Rendimento" : "Operação"} - ${asset_name}`,
                    is_investment: true, // A flag mágica!
                    executed_at: new Date(executed_at),
                    tags: {
                        connectOrCreate: tags?.map((t) => ({
                            where: { id: t },
                            create: { name: t, user_id: userId, color_hex: "#10B981" }, // Verde investimento
                        })),
                    },
                },
            });
            // 4. Atualizar o saldo da corretora
            const multiplier = transactionType === "INCOME" ? 1 : -1;
            await tx.account.update({
                where: { id: account_id },
                data: { balance: { increment: amount * multiplier } },
            });
            return investmentTx;
        });
    }
    async getPortfolio(userId) {
        // Retorna todas as contas de investimento e o saldo total consolidado
        const accounts = await this.prisma.account.findMany({
            where: { user_id: userId, type: "INVESTMENT" },
            select: { institution_name: true, balance: true },
        });
        const totalInvested = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);
        return {
            total_invested: totalInvested,
            portfolio: accounts,
        };
    }
}
exports.InvestmentsService = InvestmentsService;
//# sourceMappingURL=investments.service.js.map