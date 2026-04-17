import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";

@Module({
  controllers: [AiController],
  providers: [AiService],
  // Se você for usar o AiService em outros módulos, adicione:
  // exports: [AiService]
})
export class AiModule {} // 👈 O nome tem que ser IGUAL ao que você importou no AppModule
