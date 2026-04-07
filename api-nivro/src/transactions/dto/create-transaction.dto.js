"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTransactionDto {
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsNotEmpty)()
    account_id; // De qual banco saiu o dinheiro?
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsNotEmpty)()
    amount;
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    description;
    @(0, class_validator_1.IsEnum)(client_1.TransactionType)
    @(0, class_validator_1.IsNotEmpty)()
    type; // INCOME, EXPENSE ou TRANSFER
    @(0, class_validator_1.IsOptional)()
    @(0, class_validator_1.IsUUID)()
    category_id;
    @(0, class_validator_1.IsArray)()
    @(0, class_validator_1.IsString)({ each: true })
    @(0, class_validator_1.IsOptional)()
    tags; // Ex: ["Lazer", "PicPay", "Final de Semana"]
    @(0, class_validator_1.IsNotEmpty)()
    executed_at; // Data da transação
}
exports.CreateTransactionDto = CreateTransactionDto;
//# sourceMappingURL=create-transaction.dto.js.map