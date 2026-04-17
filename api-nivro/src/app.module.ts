import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config"; // 👈 1. Importe o ConfigModule
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { InvestmentsModule } from "./investments/investments.module";
import { CategoriesModule } from "./categories/categories.module";
import { AiModule } from "./ai/ai.module"; // 👈 2. Importe o seu novo módulo de IA

@Module({
  imports: [
    // 3. Configure o ConfigModule como global para ler o .env em todo o projeto
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    InvestmentsModule,
    CategoriesModule,
    AiModule, // 👈 4. Registre o módulo de IA aqui
  ],
})
export class AppModule {}
