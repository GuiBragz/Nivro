import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { PrismaService } from "../prisma.service";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [AiModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
