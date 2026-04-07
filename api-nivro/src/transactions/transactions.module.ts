import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [TransactionsController], // <-- A mesma coisa aqui!
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
