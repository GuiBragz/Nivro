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
exports.InvestmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let InvestmentsService = class InvestmentsService {
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
                    executed_at: new Date(executed_at),
                    tags: tags && tags.length > 0
                        ? {
                            connectOrCreate: tags.map((t) => ({
                                where: { id: t },
                                create: { name: t, user_id: userId, color_hex: "#10B981" },
                            })),
                        }
                        : undefined,
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
};
exports.InvestmentsService = InvestmentsService;
exports.InvestmentsService = InvestmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestmentsService);
//# sourceMappingURL=investments.service.js.map