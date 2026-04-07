import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa a validação global (o que impede letras no CPF, etc)
  app.useGlobalPipes(new ValidationPipe());

  // Habilita o CORS para o seu App React Native conseguir conectar
  app.enableCors();

  await app.listen(3000);
  console.log(`🚀 Nivro API rodando em: http://localhost:3000`);
}
bootstrap();
