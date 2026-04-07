"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const create_account_dto_1 = require("./dto/create-account.dto");
@(0, common_1.Injectable)()
class AccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.account.create({
            data: {
                ...data,
                user_id: userId, // Garante que a conta pertence a quem está logado
            },
        });
    }
    async findAll(userId) {
        // Retorna todas as contas do usuário
        return this.prisma.account.findMany({
            where: { user_id: userId },
            orderBy: { institution_name: "asc" },
        });
    }
}
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map