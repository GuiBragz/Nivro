import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "../prisma.service";

@Module({
  controllers: [UsersController], // <-- É ISSO AQUI QUE FALTAVA!
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
