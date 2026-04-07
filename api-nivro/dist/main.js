"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Ativa a validação global (o que impede letras no CPF, etc)
    app.useGlobalPipes(new common_1.ValidationPipe());
    // Habilita o CORS para o seu App React Native conseguir conectar
    app.enableCors();
    await app.listen(3000);
    console.log(`🚀 Nivro API rodando em: http://localhost:3000`);
}
bootstrap();
//# sourceMappingURL=main.js.map