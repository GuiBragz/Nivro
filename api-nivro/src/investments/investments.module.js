"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentsModule = void 0;
const common_1 = require("@nestjs/common");
const investments_service_1 = require("./investments.service");
const investments_controller_1 = require("./investments.controller");
const prisma_service_1 = require("../prisma.service");
@(0, common_1.Module)({
    controllers: [investments_controller_1.InvestmentsController],
    providers: [investments_service_1.InvestmentsService, prisma_service_1.PrismaService],
})
class InvestmentsModule {
}
exports.InvestmentsModule = InvestmentsModule;
//# sourceMappingURL=investments.module.js.map