"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvestmentDto = void 0;
const class_validator_1 = require("class-validator");
var InvestmentOperation;
(function (InvestmentOperation) {
    InvestmentOperation["BUY"] = "BUY";
    InvestmentOperation["SELL"] = "SELL";
    InvestmentOperation["DIVIDEND"] = "DIVIDEND";
})(InvestmentOperation || (InvestmentOperation = {}));
class CreateInvestmentDto {
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsNotEmpty)()
    account_id; // ID da corretora (Conta tipo INVESTMENT)
    @(0, class_validator_1.IsEnum)(InvestmentOperation)
    @(0, class_validator_1.IsNotEmpty)()
    operation;
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.IsNotEmpty)()
    amount;
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    asset_name; // Ex: "MXRF11", "Tesouro Direto", "CDB Itaú"
    @(0, class_validator_1.IsArray)()
    @(0, class_validator_1.IsString)({ each: true })
    @(0, class_validator_1.IsOptional)()
    tags; // Ex: ["Renda Fixa", "FIIs", "Ações"]
    @(0, class_validator_1.IsNotEmpty)()
    executed_at;
}
exports.CreateInvestmentDto = CreateInvestmentDto;
//# sourceMappingURL=create-investment.dto.js.map