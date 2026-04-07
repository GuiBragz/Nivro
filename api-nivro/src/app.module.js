"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const accounts_module_1 = require("./accounts/accounts.module");
const transactions_module_1 = require("./transactions/transactions.module");
const investments_module_1 = require("./investments/investments.module");
@(0, common_1.Module)({
    imports: [
        auth_module_1.AuthModule,
        users_module_1.UsersModule,
        accounts_module_1.AccountsModule,
        transactions_module_1.TransactionsModule,
        investments_module_1.InvestmentsModule,
    ],
})
class AppModule {
}
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map