"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_service_1 = require("./accounts.service");
const accounts_controller_1 = require("./accounts.controller");
const prisma_service_1 = require("../prisma.service");
@(0, common_1.Module)({
    controllers: [accounts_controller_1.AccountsController],
    providers: [accounts_service_1.AccountsService, prisma_service_1.PrismaService],
})
class AccountsModule {
}
exports.AccountsModule = AccountsModule;
//# sourceMappingURL=accounts.module.js.map