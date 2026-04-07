"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
@(0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"))
@(0, common_1.Controller)("transactions")
class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    @(0, common_1.Post)()
    async create(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Body)()
    dto) {
        return this.transactionsService.create(req.user.userId, dto);
    }
    @(0, common_1.Get)("dashboard")
    async getDashboard(
    @(0, common_1.Req)()
    req) {
        return this.transactionsService.getDashboard(req.user.userId);
    }
}
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map