"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://api-talentsy.onrender.com'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type,Authorization'
    });
    await app.listen(process.env.PORT || 5000);
    console.log(`✅ Servidor rodando em porta ${process.env.PORT || 5000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map