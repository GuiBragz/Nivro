"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
@(0, common_1.Controller)("auth")
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, common_1.Post)("login")
    async login(
    @(0, common_1.Body)()
    body) {
        return this.authService.login(body.email, body.password);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map