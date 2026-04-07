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
exports.CreateInvestmentDto = void 0;
const class_validator_1 = require("class-validator");
var InvestmentOperation;
(function (InvestmentOperation) {
    InvestmentOperation["BUY"] = "BUY";
    InvestmentOperation["SELL"] = "SELL";
    InvestmentOperation["DIVIDEND"] = "DIVIDEND";
})(InvestmentOperation || (InvestmentOperation = {}));
class CreateInvestmentDto {
}
exports.CreateInvestmentDto = CreateInvestmentDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestmentDto.prototype, "account_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(InvestmentOperation),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestmentDto.prototype, "operation", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateInvestmentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestmentDto.prototype, "asset_name", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateInvestmentDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvestmentDto.prototype, "executed_at", void 0);
//# sourceMappingURL=create-investment.dto.js.map