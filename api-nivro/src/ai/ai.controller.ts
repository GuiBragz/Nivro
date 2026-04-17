import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport"; // Assumindo que você usa Passport
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(AuthGuard("jwt")) // Protege a rota com o seu login
  @Post("chat")
  async chat(@Req() req: any, @Body() body: { message: string }) {
    // Pega o nome do usuário direto do token JWT
    const userName = req.user.full_name || "Guilherme";

    const response = await this.aiService.getFinancialInsight(
      body.message,
      userName,
    );

    return { content: response };
  }
}
