import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { InvestmentsModule } from "./investments/investments.module";
import { CategoriesModule } from "./categories/categories.module"; // 👈 Import adicionado

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    InvestmentsModule,
    CategoriesModule, // 👈 Módulo registrado
  ],
})
export class AppModule {}
