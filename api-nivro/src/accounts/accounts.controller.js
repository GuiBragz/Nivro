"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const accounts_service_1 = require("./accounts.service");
const create_account_dto_1 = require("./dto/create-account.dto");
@(0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")) // 🔒 Tranca todas as rotas deste controller!
@(0, common_1.Controller)("accounts")
class AccountsController {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    @(0, common_1.Post)()
    async create(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Body)()
    createAccountDto) {
        // O JwtStrategy coloca os dados do usuário dentro de req.user
        const userId = req.user.userId;
        return this.accountsService.create(userId, createAccountDto);
    }
    @(0, common_1.Get)()
    async findAll(
    @(0, common_1.Req)()
    req) {
        const userId = req.user.userId;
        return this.accountsService.findAll(userId);
    }
}
exports.AccountsController = AccountsController;
//# sourceMappingURL=accounts.controller.js.map