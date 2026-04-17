"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config"); // 👈 1. Importe o ConfigModule
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const accounts_module_1 = require("./accounts/accounts.module");
const transactions_module_1 = require("./transactions/transactions.module");
const investments_module_1 = require("./investments/investments.module");
const categories_module_1 = require("./categories/categories.module");
const ai_module_1 = require("./ai/ai.module"); // 👈 2. Importe o seu novo módulo de IA
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // 3. Configure o ConfigModule como global para ler o .env em todo o projeto
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            accounts_module_1.AccountsModule,
            transactions_module_1.TransactionsModule,
            investments_module_1.InvestmentsModule,
            categories_module_1.CategoriesModule,
            ai_module_1.AiModule, // 👈 4. Registre o módulo de IA aqui
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map