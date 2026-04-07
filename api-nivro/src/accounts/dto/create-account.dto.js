"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client"); // O Prisma já gerou esse Enum para você!
class CreateAccountDto {
    @(0, class_validator_1.IsEnum)(client_1.AccountType, {
        message: "O tipo deve ser CHECKING, CREDIT, INVESTMENT ou WALLET",
    })
    @(0, class_validator_1.IsNotEmpty)()
    type;
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    institution_name;
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsOptional)()
    balance; // Saldo inicial (opcional, default é 0)
    // Específicos para cartão de crédito
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsOptional)()
    credit_limit;
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsOptional)()
    closing_day;
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsOptional)()
    due_day;
}
exports.CreateAccountDto = CreateAccountDto;
//# sourceMappingURL=create-account.dto.js.map