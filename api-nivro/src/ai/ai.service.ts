import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Groq from "groq-sdk";

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GROQ_API_KEY");
    this.groq = new Groq({ apiKey });
  }

  async getFinancialInsight(message: string, userName: string) {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é o Nivro AI, consultor financeiro do ${userName}. Responda de forma curta e prática.`,
        },
        { role: "user", content: message },
      ],
      model: "llama-3.1-8b-instant",
    });

    return chatCompletion.choices[0]?.message?.content || "Pensando...";
  }

  // 👇 MÉTODO NOVO: O MOTOR DO EXTRATO BANCÁRIO 👇
  async categorizeTransaction(rawDescription: string) {
    const prompt = `Analise a seguinte descrição de extrato bancário: "${rawDescription}".
    Limpe o nome da empresa e classifique em uma categoria.
    Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
    {
      "cleanDescription": "Nome comercial limpo (ex: iFood, Uber, Netflix, Posto Ipiranga)",
      "category": "Uma destas: Alimentação, Transporte, Lazer, Saúde, Educação, Moradia, Salário ou Outros"
    }`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Você é um processador de dados financeiros automatizado. Você responde estritamente em JSON e nunca adiciona texto antes ou depois da resposta.",
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }, // 👈 A mágica acontece aqui! Força o JSON.
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "{}";

      // O NestJS já vai transformar isso num objeto JavaScript pronto para o Prisma
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Erro ao categorizar transação com IA:", error);
      // Se a IA falhar, a gente devolve um padrão seguro para o app não crashar
      return {
        cleanDescription: rawDescription, // Mantém o nome feio
        category: "Outros",
      };
    }
  }
}
