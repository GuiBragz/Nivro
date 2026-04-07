"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const investments_service_1 = require("./investments.service");
const create_investment_dto_1 = require("./dto/create-investment.dto");
@(0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"))
@(0, common_1.Controller)("investments")
class InvestmentsController {
    investmentsService;
    constructor(investmentsService) {
        this.investmentsService = investmentsService;
    }
    @(0, common_1.Post)()
    async create(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Body)()
    dto) {
        return this.investmentsService.create(req.user.userId, dto);
    }
    @(0, common_1.Get)("portfolio")
    async getPortfolio(
    @(0, common_1.Req)()
    req) {
        return this.investmentsService.getPortfolio(req.user.userId);
    }
}
exports.InvestmentsController = InvestmentsController;
//# sourceMappingURL=investments.controller.js.map